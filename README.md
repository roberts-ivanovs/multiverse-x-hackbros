# MultiversX hackathon entry

## Development setup

```bash
cargo install cargo-make
cargo make

# Run the server.
cargo make run
cargo make run --release

# Run the tests
cargo make test
cargo make coverage

# Check if the CI tasks will pass
cargo make local-ci

# Format the code
cargo make fmt
```
