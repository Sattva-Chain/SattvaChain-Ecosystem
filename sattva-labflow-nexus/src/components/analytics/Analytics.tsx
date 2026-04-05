import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface AnalyticsProps {
  onNavigate: (view: string) => void;
}

export const Analytics = ({ onNavigate }: AnalyticsProps) => {
  const trendData = [
    { month: "Jan", tests: 45, passed: 42, flagged: 3 },
    { month: "Feb", tests: 52, passed: 48, flagged: 4 },
    { month: "Mar", tests: 38, passed: 35, flagged: 3 },
    { month: "Apr", tests: 61, passed: 58, flagged: 3 },
    { month: "May", tests: 48, passed: 46, flagged: 2 },
  ];

  const recentAnomalies = [
    { batch: "BTH-001", herb: "Ashwagandha", issue: "Heavy Metal Pb above limit", severity: "high" },
    { batch: "BTH-045", herb: "Turmeric", issue: "Moisture content high", severity: "medium" },
    { batch: "BTH-023", herb: "Brahmi", issue: "Pesticide residue detected", severity: "high" },
  ];

  const qualityMetrics = [
    { metric: "Overall Pass Rate", value: "94.2%", trend: "up", color: "success" },
    { metric: "Heavy Metal Compliance", value: "98.1%", trend: "stable", color: "success" },
    { metric: "Microbial Safety", value: "96.7%", trend: "up", color: "success" },
    { metric: "Pesticide Compliance", value: "91.3%", trend: "down", color: "warning" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate("dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">Laboratory testing trends and quality metrics</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {qualityMetrics.map((metric, index) => (
          <Card key={index} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.metric}
              </CardTitle>
              <TrendingUp className={`h-4 w-4 ${
                metric.color === 'success' ? 'text-success' :
                metric.color === 'warning' ? 'text-warning' :
                'text-info'
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-xs text-muted-foreground">
                {metric.trend === 'up' ? '↗️ Improving' : 
                 metric.trend === 'down' ? '↘️ Declining' : 
                 '→ Stable'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Testing Trends Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Monthly Testing Trends</CardTitle>
            <CardDescription>Tests conducted and results over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="font-medium w-10">{data.month}</div>
                    <div className="text-sm text-muted-foreground">
                      {data.tests} tests
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-success border-success">
                      {data.passed} passed
                    </Badge>
                    {data.flagged > 0 && (
                      <Badge variant="outline" className="text-warning border-warning">
                        {data.flagged} flagged
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Anomalies */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Anomalies</CardTitle>
            <CardDescription>Flagged test results requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnomalies.map((anomaly, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                    anomaly.severity === 'high' ? 'text-destructive' : 'text-warning'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{anomaly.batch}</div>
                      <Badge variant={anomaly.severity === 'high' ? 'destructive' : 'secondary'}>
                        {anomaly.severity}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{anomaly.herb}</div>
                    <div className="text-sm">{anomaly.issue}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch Status Summary */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Batch Status Summary</CardTitle>
          <CardDescription>Overview of all batches and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <CheckCircle className="h-12 w-12 text-success mx-auto" />
              <div className="text-2xl font-bold">187</div>
              <div className="text-sm text-muted-foreground">Completed Tests</div>
            </div>
            <div className="text-center space-y-2">
              <Clock className="h-12 w-12 text-warning mx-auto" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Tests in Progress</div>
            </div>
            <div className="text-center space-y-2">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm text-muted-foreground">Flagged Results</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};