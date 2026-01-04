<?php

namespace App\Concerns;

use App\Models\UserTablePreference;

/**
 * @property string $exportFormat
 * @property bool $showExportModal
 * @property array $columnVisibility
 * @property bool $showColumnModal
 *
 */
trait WithExport
{
    // Column Management
    public bool $showColumnModal = false;
    public array $columnVisibility = [];

    // Export Management
    public bool $showExportModal = false;
    public string $exportFormat = 'xlsx';

    public function exportToExcel()
    {
        $type = $this->getExportType();
        return redirect()->route('export', ['type' => $type, 'format' => 'xlsx']);
    }

    public function exportToCsv()
    {
        $type = $this->getExportType();
        return redirect()->route('export', ['type' => $type, 'format' => 'csv']);
    }

    public function exportToPdf()
    {
        $type = $this->getExportType();
        return redirect()->route('export', ['type' => $type, 'format' => 'pdf']);
    }

    abstract protected function getExportType(): string;

    public function loadColumnPreferences(): void
    {
        $preference = UserTablePreference::where('user_id', auth('web')->id())
            ->where('page', 'asset-findings')
            ->first();

        if ($preference && $preference->column_visibility) {
            $this->columnVisibility = $preference->column_visibility;
        } else {
            foreach ($this->headers() as $header) {
                $this->columnVisibility[$header['key']] = true;
            }
        }
    }

    public function saveColumnPreferences(): void
    {
        UserTablePreference::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'page' => 'asset-inventory',
            ],
            [
                'column_visibility' => $this->columnVisibility,
            ]
        );

        $this->showColumnModal = false;
        $this->success('Column preferences saved!');
    }

    public function export(): void
    {
        match($this->exportFormat) {
            'csv' => $this->exportToCsv(),
            'pdf' => $this->exportToPdf(),
            default => $this->exportToExcel(),
        };

        $this->showExportModal = false;
        $this->success('Export started!');
    }

    protected function getExportData(): array
    {
        if (method_exists($this, 'getFilteredQuery')) {
            $query = $this->getFilteredQuery();

            if (property_exists($this, 'search') && !empty($this->search)) {
                if (method_exists($this, 'applySearch')) {
                    $query = $this->applySearch($query);
                }
            }

            return $query->get()->map(function ($item) {
                $array = $item->toArray();

                foreach ($array as $key => $value) {
                    if ($value instanceof \BackedEnum) {
                        $array[$key] = $value->value;
                    } elseif ($value instanceof \UnitEnum) {
                        $array[$key] = $value->name;
                    } elseif (is_object($value)) {
                        $array[$key] = method_exists($value, '__toString') ? (string)$value : '';
                    } elseif (is_array($value)) {
                        $array[$key] = '';
                    } elseif (is_string($value)) {
                        // Clean UTF-8
                        $array[$key] = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
                    }
                }

                return $array;
            })->toArray();
        }

        return [];
    }

    protected function getExportHeaders(): array
    {
        if (property_exists($this, 'visibleHeaders')) {
            return collect($this->visibleHeaders)
                ->filter(fn($header) => $header['key'] !== 'actions')
                ->pluck('label', 'key')
                ->toArray();
        }

        if (method_exists($this, 'headers')) {
            return collect($this->headers())
                ->filter(fn($header) => $header['key'] !== 'actions')
                ->pluck('label', 'key')
                ->toArray();
        }

        return [];
    }

    protected function getExportFilename(): string
    {
        // Override this method in component
        return 'export';
    }

    protected function getExportTitle(): string
    {
        // Override this method in component
        return 'Export Report';
    }

    protected function generateCsv(array $data, array $headers): string
    {
        $output = fopen('php://temp', 'r+');

        fputcsv($output, array_values($headers));

        foreach ($data as $row) {
            $csvRow = [];
            foreach (array_keys($headers) as $key) {
                $csvRow[] = $row[$key] ?? '';
            }
            fputcsv($output, $csvRow);
        }

        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);

        return $csv;
    }
}
