# Smile, a foto booth application

A fun project to try out the native MediaDevices web APIs for integration within Nuxt.
You can preview this project here: [https://smile.andywillekens.nl](https://smile.andywillekens.nl)

## Requirements

Ensure you have the following installed:

- **Docker** - For containerization
- **Docker Compose** - For orchestrating multiple containers
- **Prettier** - Code formatter (recommended VS Code plugin)
- **Tailwind CSS IntelliSense** - VS Code plugin for Tailwind class suggestions and completions
- **TypeScript and JavaScript Language Features** - Bundled with VS Code; ensure it's enabled for optimal support

## Getting Started

To start the development server locally:

```bash
docker compose up -d
```

This command builds and launches the Nuxt development environment within Docker. Once started, you can access the project in your browser at [http://localhost:3000](http://localhost:3000).

## Stopping the Development Environment

To stop and remove the running containers:

```bash
docker compose down
```

## Troubleshooting

If you encounter any issues, try rebuilding the containers:

```bash
docker compose up -d --force-recreate --build
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to enhance the setup.
