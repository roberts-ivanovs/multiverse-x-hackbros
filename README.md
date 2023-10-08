# MultiversX hackathon entry

## Development setup

### Frontend

```bash
# Install dependencies
pnpm install

# Run the webserver
nx serve frontend

# Run the typecheck
nx typecheck frontend
```

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

### CLI

```bash
# Install xSuite globally.
pnpm install -g xsuite

# Cd into the contracts folder
cd crates/bridge-contract

# Create a wallet
xsuite new-wallet --wallet wallet.json

# Fund wallet with eGld
xsuite request-xegld --wallet wallet.json

# Install dependencies
pnpm install
# Compile the vault smart contract
pnpm build

# Deploy the contract on devnet
pnpm interact:devnet deploy
```

Simple set value smart contract deployed on devnet at this address `erd1qqqqqqqqqqqqqpgqlul000yk8zufcp7gfsdt573q6syqtcaqrq0q6jdrw6`
