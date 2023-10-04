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

```bash

## Install the MultiversX python cli sdk.
python3 mxpy-up.py

# Create a wallet
mxpy wallet new --format pem --outfile wallet.pem

# Compile the smart contracts
mxpy contract build

# Set-up local network
mkdir localnet && cd localnet
mxpy localnet setup
mxpy localnet start
```
