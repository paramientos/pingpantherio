<?php

namespace App\Concerns;

use App\Models\SavedQuery;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait WithQueryBuilder
{
    // Query State
    public array $queries = [];

    // Save/Load State
    public bool $showSaveQueryModal = false;
    public string $newQueryName = '';
    public bool $isPublicQuery = false;
    public ?string $loadedQueryId = null;

    // Operators Configuration
    public array $operators = [
        'equals' => 'equals',
        'not_equals' => 'not equals',
        'contains' => 'contains',
        'not_contains' => 'not contains',
        'starts_with' => 'starts with',
        'ends_with' => 'ends with',
        'is_empty' => 'is empty',
        'is_not_empty' => 'is not empty',
        'gt' => 'greater than',
        'lt' => 'less than',
        'gte' => 'greater than or equal',
        'lte' => 'less than or equal',
    ];

    public function mountWithQueryBuilder(): void
    {
        if (empty($this->queries)) {
            $this->queries = [
                ['type' => 'rule', 'logic' => 'and', 'field' => '', 'operator' => 'equals', 'value' => '']
            ];
        }
    }

    public function updatedQueries(): void
    {
        // Reset pagination when queries change
        if (method_exists($this, 'resetPage')) {
            $this->resetPage();
        }
    }

    public function addQuery(string $targetGroup = null): void
    {
        // For now, we only support adding to root.
        // To support deep nesting, we'd need a path/ID system.
        // Keeping it simple: Root level rules.
        $this->queries[] = ['type' => 'rule', 'logic' => 'and', 'field' => '', 'operator' => 'equals', 'value' => ''];
    }

    public function addGroup(): void
    {
        $this->queries[] = [
            'type' => 'group',
            'logic' => 'and',
            'queries' => [
                ['type' => 'rule', 'logic' => 'and', 'field' => '', 'operator' => 'equals', 'value' => '']
            ]
        ];
    }

    public function addRuleToGroup(int $groupIndex): void
    {
        $this->queries[$groupIndex]['queries'][] = ['type' => 'rule', 'logic' => 'and', 'field' => '', 'operator' => 'equals', 'value' => ''];
    }

    public function removeQueryFromGroup(int $groupIndex, int $ruleIndex): void
    {
        unset($this->queries[$groupIndex]['queries'][$ruleIndex]);
        $this->queries[$groupIndex]['queries'] = array_values($this->queries[$groupIndex]['queries']);

        // If group is empty, remove the group? Or keep it empty?
        // Let's remove the group if empty to avoid confusion
        if (empty($this->queries[$groupIndex]['queries'])) {
            $this->removeQuery($groupIndex);
        }
    }

    public function removeQuery(int $index): void
    {
        unset($this->queries[$index]);
        $this->queries = array_values($this->queries);

        // Keep at least one query
        if (empty($this->queries)) {
            $this->queries = [
                ['type' => 'rule', 'logic' => 'and', 'field' => '', 'operator' => 'equals', 'value' => '']
            ];
        }
    }

    public function clearQueries(): void
    {
        $this->queries = [
            ['type' => 'rule', 'logic' => 'and', 'field' => '', 'operator' => 'equals', 'value' => '']
        ];
        $this->loadedQueryId = null;
    }

    public function getSavedQueriesProperty()
    {
        return SavedQuery::where('context', $this->getQueryContext())
            ->where(function($q) {
                $q->where('user_id', Auth::id())
                  ->orWhere('is_public', true);
            })
            ->orderBy('name')
            ->get();
    }

    public function saveQuery(): void
    {
        $this->validate([
            'newQueryName' => 'required|string|max:255',
        ]);

        SavedQuery::create([
            'name' => $this->newQueryName,
            'context' => $this->getQueryContext(),
            'user_id' => Auth::id(),
            'is_public' => $this->isPublicQuery,
            'query_data' => $this->queries,
        ]);

        $this->showSaveQueryModal = false;
        $this->newQueryName = '';
        $this->isPublicQuery = false;

        $this->dispatch('toast', title: 'Query saved successfully!', type: 'success');
    }

    public function loadQuery(string $queryId): void
    {
        $savedQuery = SavedQuery::findOrFail($queryId);
        $this->queries = $savedQuery->query_data;
        $this->loadedQueryId = $queryId;

        $this->dispatch('toast', title: "Loaded: {$savedQuery->name}", type: 'success');
    }

    public function deleteQuery(string $queryId): void
    {
        $savedQuery = SavedQuery::findOrFail($queryId);

        // Only allow deletion if user owns the query
        if ($savedQuery->user_id !== Auth::id()) {
            $this->dispatch('toast', title: 'You can only delete your own queries.', type: 'error');
            return;
        }

        $savedQuery->delete();

        if ($this->loadedQueryId === $queryId) {
            $this->loadedQueryId = null;
        }

        $this->dispatch('toast', title: 'Query deleted.', type: 'success');
    }

    abstract protected function getQueryContext(): string;

    public function applyQueryBuilder(Builder $query, array $rules = null): Builder
    {
        $rules = $rules ?? $this->queries;

        return $query->where(function (Builder $q) use ($rules) {
            foreach ($rules as $index => $rule) {
                $logic = $rule['logic'] ?? 'and';
                $method = ($index === 0 || $logic === 'and') ? 'where' : 'orWhere';

                if (($rule['type'] ?? 'rule') === 'group') {
                    // Handle Group
                    if (!empty($rule['queries'])) {
                        $q->$method(function ($subQ) use ($rule) {
                            $this->applyQueryBuilder($subQ, $rule['queries']);
                        });
                    }
                } else {
                    // Handle Rule
                    // Skip incomplete rules
                    if (empty($rule['field'])) continue;

                    // Skip rules with empty values unless operator doesn't need value
                    if (
                        !in_array($rule['operator'], ['is_empty', 'is_not_empty']) &&
                        (empty($rule['value']) && $rule['value'] !== '0')
                    ) {
                        continue;
                    }

                    $field = $rule['field'];
                    $op = $rule['operator'];
                    $val = $rule['value'] ?? null;

                    $q->$method(function (Builder $subQ) use ($field, $op, $val) {
                        // Handle Relation Fields (user.name, etc.)
                        if (str_contains($field, '.')) {
                            [$relation, $col] = explode('.', $field);
                            $subQ->whereHas($relation, function (Builder $relQuery) use ($col, $op, $val) {
                                $this->applyCondition($relQuery, $col, $op, $val);
                            });
                        } else {
                            // Handle Special Fields Logic
                            if (method_exists($this, 'applyCustomQueryLogic')) {
                                $handled = $this->applyCustomQueryLogic($subQ, $field, $op, $val);
                                if ($handled) return;
                            }

                            $this->applyCondition($subQ, $field, $op, $val);
                        }
                    });
                }
            }
        });
    }

    protected function applyCondition(Builder $query, string $column, string $operator, mixed $value): void
    {
        match ($operator) {
            'equals' => $query->where($column, $value),
            'not_equals' => $query->where($column, '!=', $value),
            'contains' => $query->where($column, 'ilike', "%{$value}%"),
            'not_contains' => $query->where($column, 'not ilike', "%{$value}%"),
            'starts_with' => $query->where($column, 'ilike', "{$value}%"),
            'ends_with' => $query->where($column, 'ilike', "%{$value}"),
            'is_empty' => $query->where(fn($q) => $q->whereNull($column)->orWhere($column, '')),
            'is_not_empty' => $query->where(fn($q) => $q->whereNotNull($column)->where($column, '!=', '')),
            'gt' => $query->where($column, '>', $value),
            'gte' => $query->where($column, '>=', $value),
            'lt' => $query->where($column, '<', $value),
            'lte' => $query->where($column, '<=', $value),
            default => $query->where($column, $value),
        };
    }
}
