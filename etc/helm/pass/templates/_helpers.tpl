{{- define "pass.hosts.httpapi" -}}
{{- print "https://" (.Values.global.hosts.httpapi | replace "[RELEASE_NAME]" .Release.Name) -}}
{{- end -}}
{{- define "pass.hosts.angular" -}}
{{- print "https://" (.Values.global.hosts.angular | replace "[RELEASE_NAME]" .Release.Name) -}}
{{- end -}}
