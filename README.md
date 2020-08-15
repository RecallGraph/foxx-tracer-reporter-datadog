# foxx-tracer-reporter-datadog
A reporter for the [foxx-tracer-collector](https://github.com/RecallGraph/foxx-tracer-collector) service, that pushes spans to Datadog.

## Installation
See the [collector docs](https://github.com/RecallGraph/foxx-tracer-collector/wiki/Reporters#adding-a-reporter) for detailed instruction docs. To quickly get up and running, run the following inside the collector's source root:
```bash
npx grunt reporter:add --pkg=@recallgraph/foxx-tracer-reporter-datadog --namespace=datadog 
```

## Configuration
This reporter has a single configuration parameter, viz, the location of the [Datadog Agent](https://docs.datadoghq.com/agent/) to which it should report span records. If the reporter is installed under the namespace `datadog`, then the `manifest.json` of the collector would have a section like:
```json
{
    "configuration": {
        "reporters-datadog": {
            "type": "json",
            "required": true,
            "default": {
                "dd-agent-url": "http://localhost:8126/v0.4/traces"
            },
            "description": "Settings for the datadog reporter."
        }
    }
}
```
You can change the `dd-agent-url` parameter to value if needed.
