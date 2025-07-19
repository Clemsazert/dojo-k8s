{{/*
Expand the name of the chart.
*/}}
{{- define "cleaner.name" -}}
{{- .Chart.Name }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "cleaner.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "cleaner.labels" -}}
helm.sh/chart: {{ include "cleaner.chart" . }}
{{ include "cleaner.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "cleaner.selectorLabels" -}}
app.kubernetes.io/name: {{ include "cleaner.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
