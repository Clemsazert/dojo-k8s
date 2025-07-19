{{/*
Expand the name of the chart.
*/}}
{{- define "client.name" -}}
{{- .Chart.Name }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "client.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "client.labels" -}}
helm.sh/chart: {{ include "client.chart" . }}
{{ include "client.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "client.selectorLabels" -}}
app.kubernetes.io/name: {{ include "client.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
