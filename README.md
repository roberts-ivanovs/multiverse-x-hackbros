# MultiversX hackathon entry

## Development setup

### Backend
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

### Frontend

```bash
# Install dependencies
pnpm install

# Run the webserver
nx serve frontend

# Run the typecheck
nx typecheck frontend
```