<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>PingPanther - Uptime Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            padding: 40px;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #6366f1;
            padding-bottom: 20px;
        }

        .header h1 {
            color: #6366f1;
            font-size: 32px;
            margin-bottom: 10px;
        }

        .header p {
            color: #666;
            font-size: 14px;
        }

        .meta {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
        }

        .meta-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .meta-label {
            font-weight: 600;
            color: #555;
        }

        .monitor-section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }

        .monitor-header {
            background: #6366f1;
            color: white;
            padding: 15px;
            border-radius: 8px 8px 0 0;
        }

        .monitor-header h2 {
            font-size: 20px;
            margin-bottom: 5px;
        }

        .monitor-header p {
            font-size: 12px;
            opacity: 0.9;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            padding: 20px;
            background: white;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 8px 8px;
        }

        .stat-card {
            text-align: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 6px;
        }

        .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #6366f1;
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .uptime-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
        }

        .uptime-excellent {
            background: #d1fae5;
            color: #065f46;
        }

        .uptime-good {
            background: #fef3c7;
            color: #92400e;
        }

        .uptime-poor {
            background: #fee2e2;
            color: #991b1b;
        }

        .footer {
            margin-top: 60px;
            text-align: center;
            color: #999;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>🐾 PingPanther</h1>
        <p>Uptime & Performance Report</p>
    </div>

    <div class="meta">
        <div class="meta-row">
            <span class="meta-label">Report Period:</span>
            <span>Last {{ $period }} days</span>
        </div>
        <div class="meta-row">
            <span class="meta-label">Generated:</span>
            <span>{{ $generated_at }}</span>
        </div>
        <div class="meta-row">
            <span class="meta-label">Account:</span>
            <span>{{ $user->name }} ({{ $user->email }})</span>
        </div>
    </div>

    @foreach ($analytics as $data)
        <div class="monitor-section">
            <div class="monitor-header">
                <h2>{{ $data['monitor_name'] }}</h2>
                <p>{{ $data['monitor_url'] }}</p>
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">
                        <span
                            class="uptime-badge {{ $data['uptime_percentage'] >= 99 ? 'uptime-excellent' : ($data['uptime_percentage'] >= 95 ? 'uptime-good' : 'uptime-poor') }}">
                            {{ $data['uptime_percentage'] }}%
                        </span>
                    </div>
                    <div class="stat-label">Uptime</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{{ $data['avg_response_time'] }}ms</div>
                    <div class="stat-label">Avg Response Time</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{{ $data['total_checks'] }}</div>
                    <div class="stat-label">Total Checks</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: #10b981;">{{ $data['successful_checks'] }}</div>
                    <div class="stat-label">Successful</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: #ef4444;">{{ $data['failed_checks'] }}</div>
                    <div class="stat-label">Failed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{{ $data['total_incidents'] }}</div>
                    <div class="stat-label">Incidents</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{{ $data['total_downtime_hours'] }}h</div>
                    <div class="stat-label">Total Downtime</div>
                </div>
            </div>
        </div>
    @endforeach

    <div class="footer">
        <p>This report was automatically generated by PingPanther</p>
        <p>© {{ date('Y') }} PingPanther. All rights reserved.</p>
    </div>
</body>

</html>
