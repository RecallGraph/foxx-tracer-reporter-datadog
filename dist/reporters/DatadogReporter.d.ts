import { reporters, SpanData } from '@recallgraph/foxx-tracer';

export default class DatadogReporter extends reporters.Reporter {
    constructor(namespace?: string);

    report(traces: SpanData[][]): void;
}
//# sourceMappingURL=DatadogReporter.d.ts.map