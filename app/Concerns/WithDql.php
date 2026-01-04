<?php

namespace App\Concerns;

use App\Services\DqlParser;
use Illuminate\Database\Eloquent\Builder;

/**
 * Trait for adding DQL support to Livewire components
 * 
 * Usage:
 * 1. Use this trait in your Livewire component
 * 2. Add $useDql and $dqlQuery properties
 * 3. Call applyDql() on your query builder
 */
trait WithDql
{
    public bool $useDql = false;
    public string $dqlQuery = '';
    public ?string $dqlError = null;
    public array $dqlParsedRules = [];

    protected DqlParser $dqlParser;

    public function bootWithDql(): void
    {
        $this->dqlParser = new DqlParser();
    }

    public function mountWithDql(): void
    {
        $this->useDql = false;
        $this->dqlQuery = '';
    }

    /**
     * Toggle between DQL and visual query builder
     */
    public function toggleDqlMode(): void
    {
        $this->useDql = !$this->useDql;
        
        if ($this->useDql && !empty($this->queries)) {
            // Convert visual queries to DQL
            $this->dqlQuery = $this->dqlParser->toDql($this->queries);
        } elseif (!$this->useDql && !empty($this->dqlQuery)) {
            // Parse DQL to visual queries
            try {
                $this->queries = $this->dqlParser->parse($this->dqlQuery, $this->getFieldConfig());
                $this->dqlError = null;
            } catch (\Exception $e) {
                $this->dqlError = $e->getMessage();
            }
        }
    }

    /**
     * Validate DQL syntax
     */
    public function validateDqlSyntax(): void
    {
        $result = $this->dqlParser->validate($this->dqlQuery);
        
        if ($result['valid']) {
            $this->dqlError = null;
            $this->dispatch('toast', title: '✓ DQL syntax is valid', type: 'success');
        } else {
            $this->dqlError = $result['message'];
            $this->dispatch('toast', title: 'DQL syntax error', type: 'error');
        }
    }

    /**
     * Apply DQL query to Eloquent Builder
     */
    public function applyDql(Builder $query): Builder
    {
        if (!$this->useDql || empty($this->dqlQuery)) {
            return $query;
        }

        try {
            $this->dqlParsedRules = $this->dqlParser->parse($this->dqlQuery, $this->getFieldConfig());
            $query = $this->dqlParser->applyToBuilder($query, $this->dqlQuery, $this->getFieldConfig());
            $this->dqlError = null;
        } catch (\Exception $e) {
            $this->dqlError = $e->getMessage();
        }

        return $query;
    }

    /**
     * Get field configuration for DQL parser
     * Override this method in your component to provide custom field config
     */
    protected function getFieldConfig(): array
    {
        return $this->fields ?? [];
    }

    /**
     * Get DQL query from visual builder
     */
    public function getDqlFromVisual(): string
    {
        if (empty($this->queries)) {
            return '';
        }

        return $this->dqlParser->toDql($this->queries);
    }

    /**
     * Set visual queries from DQL
     */
    public function setVisualFromDql(string $dql): array
    {
        try {
            $queries = $this->dqlParser->parse($dql, $this->getFieldConfig());
            $this->dqlError = null;
            return $queries;
        } catch (\Exception $e) {
            $this->dqlError = $e->getMessage();
            return [];
        }
    }

    /**
     * Export current query as DQL
     */
    public function exportAsDql(): string
    {
        if ($this->useDql) {
            return $this->dqlQuery;
        }

        return $this->getDqlFromVisual();
    }

    /**
     * Import DQL query
     */
    public function importDql(string $dql): void
    {
        $this->dqlQuery = $dql;
        $this->useDql = true;
        $this->validateDqlSyntax();
    }

    /**
     * Get example DQL queries for the current context
     */
    public function getDqlExamples(): array
    {
        return [
            'severity = "critical"',
            'severity = "critical" AND action = "blocked"',
            'severity IN ["critical", "high"]',
            'incident_at > "2024-01-01"',
            '(severity = "critical" OR severity = "high") AND action = "blocked"',
            'status IS_NOT_EMPTY',
        ];
    }

    /**
     * Use example DQL query
     */
    public function useDqlExample(int $index): void
    {
        $examples = $this->getDqlExamples();
        
        if (isset($examples[$index])) {
            $this->dqlQuery = $examples[$index];
            $this->useDql = true;
            $this->validateDqlSyntax();
        }
    }

    /**
     * Clear DQL query
     */
    public function clearDql(): void
    {
        $this->dqlQuery = '';
        $this->dqlError = null;
        $this->dqlParsedRules = [];
    }
}
