<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;
use Schema;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->registerMacros();
    }

    public function boot(): void
    {
        // Register Blade directive for timezone conversion
        Blade::directive('userTime', function ($expression) {
            return "<?php echo \\App\\Helpers\\TimezoneHelper::toUserTz($expression); ?>";
        });

        Blade::directive('userTimeFormat', function ($expression) {
            return "<?php echo \\App\\Helpers\\TimezoneHelper::toUserTz($expression); ?>";
        });
    }

    public function registerMacros(): void
    {
        Builder::macro('arrayLike', function ($attributes, string $searchTerm) {
            $turkishMap = [
                'i' => '(i|İ|I|ı)',
                'I' => '(i|İ|I|ı)',
                'İ' => '(i|İ|I|ı)',
                'ı' => '(i|İ|I|ı)',
                'ğ' => '(ğ|Ğ)',
                'Ğ' => '(ğ|Ğ)',
                'ü' => '(ü|Ü)',
                'Ü' => '(ü|Ü)',
                'ş' => '(ş|Ş)',
                'Ş' => '(ş|Ş)',
                'ö' => '(ö|Ö)',
                'Ö' => '(ö|Ö)',
                'ç' => '(ç|Ç)',
                'Ç' => '(ç|Ç)',
            ];

            $searchPattern = $searchTerm;

            foreach ($turkishMap as $char => $pattern) {
                $searchPattern = str_replace($char, $pattern, $searchPattern);
            }

            $model = $this->getModel();
            $table = $model->getTable();

            $this->where(function (Builder $query) use ($attributes, $searchPattern, $table) {
                foreach (Arr::wrap($attributes) as $attribute) {
                    // Handle relation.column notation (supports nested: x.y.z)
                    if (str_contains($attribute, '.')) {
                        $parts = explode('.', $attribute);
                        $columnName = array_pop($parts); // Last part is the column
                        $relations = $parts; // Rest are relations

                        // Build nested whereHas for each relation level
                        $query->orWhereHas($relations[0], function (Builder $q) use ($relations, $columnName, $searchPattern) {
                            // If there are multiple relation levels (e.g., claim.asset.name)
                            if (count($relations) > 1) {
                                // Remove first relation and recursively nest
                                $nestedRelations = array_slice($relations, 1);
                                $q->whereHas($nestedRelations[0], function (Builder $q2) use ($nestedRelations, $columnName, $searchPattern) {
                                    // Continue nesting if more relations exist
                                    if (count($nestedRelations) > 1) {
                                        $deeperRelations = array_slice($nestedRelations, 1);
                                        $q2->whereHas($deeperRelations[0], function (Builder $q3) use ($columnName, $searchPattern) {
                                            $column = $q3->getGrammar()->wrap($columnName);
                                            $q3->whereRaw("$column::TEXT ~* ?", ["$searchPattern"]);
                                        });
                                    } else {
                                        // Final level - search the column
                                        $column = $q2->getGrammar()->wrap($columnName);
                                        $q2->whereRaw("$column::TEXT ~* ?", ["$searchPattern"]);
                                    }
                                });
                            } else {
                                // Single level relation (e.g., user.name)
                                $column = $q->getGrammar()->wrap($columnName);
                                $q->whereRaw("$column::TEXT ~* ?", ["$searchPattern"]);
                            }
                        });
                    } else {
                        if (Schema::hasColumn($table, $attribute)) {
                            $wrappedColumn = $query->getGrammar()->wrap($attribute);
                            $query->orWhereRaw("$wrappedColumn::TEXT ~* ?", ["$searchPattern"]);
                        }
                    }
                }
            });

            return $this;
        });

        Builder::macro('generateMaryUIChoice', function (
            string $key = 'id',
            string $label = 'name',
            string $orderBy = 'name',
            string $direction = 'asc'
        ) {
            return $this
                ->orderBy($orderBy, $direction)
                ->get()
                ->map(function ($model) use ($key, $label) {
                    // Check if key contains dot (table.column or relation.attribute)
                    if (str_contains($key, '.')) {
                        $keyParts = explode('.', $key);

                        // Try as attribute first (for joins like 'assets.id')
                        $attributeName = str_replace('.', '_', $key);
                        if (isset($model->{$attributeName})) {
                            $valueResult = $model->{$attributeName};
                        } else {
                            // Try as relation navigation
                            $valueResult = $model;
                            foreach ($keyParts as $segment) {
                                $valueResult = $valueResult->{$segment} ?? null;
                                if ($valueResult === null) {
                                    break;
                                }
                            }
                        }
                    } else {
                        $valueResult = $model->{$key} ?? null;
                    }

                    // Same logic for label
                    if (str_contains($label, '.')) {
                        $labelParts = explode('.', $label);

                        // Try as attribute first (for joins like 'assets.name')
                        $attributeName = str_replace('.', '_', $label);
                        if (isset($model->{$attributeName})) {
                            $labelResult = $model->{$attributeName};
                        } else {
                            // Try as relation navigation
                            $labelResult = $model;
                            foreach ($labelParts as $segment) {
                                $labelResult = $labelResult->{$segment} ?? null;
                                if ($labelResult === null) {
                                    break;
                                }
                            }
                        }
                    } else {
                        $labelResult = $model->{$label} ?? null;
                    }

                    return [
                        'value' => $valueResult,
                        'label' => $labelResult,
                    ];
                })
                ->toArray();
        });
    }

    public function configureSmtpSettings(): void
    {
        // Configure mail settings from database
        try {

        } catch (\Exception $e) {
            //
        }
    }
}
