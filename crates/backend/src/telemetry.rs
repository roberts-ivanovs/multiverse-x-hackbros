use tracing_subscriber::prelude::*;
use tracing_subscriber::{EnvFilter, Registry};

pub fn init_telemetry() {
    // Define a tracer
    let subscriber = Registry::default();
    let level_filter_layer = EnvFilter::try_from_default_env().unwrap_or(EnvFilter::new("INFO"));

    let output_layer = tracing_subscriber::fmt::layer()
        .with_line_number(true)
        .with_ansi(true)
        .with_file(true)
        .with_writer(std::io::stderr);

    subscriber
        .with(level_filter_layer)
        .with(output_layer)
        .init()
}
