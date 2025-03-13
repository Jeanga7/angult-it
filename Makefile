NVM_VERSION := v0.39.0
NODE_VERSION := node
ANGULAR_CLI_VERSION := latest

# Installation de NVM
install-nvm:
	@echo "Installing NVM..."
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/$(NVM_VERSION)/install.sh | bash
	@echo "NVM installed. Please restart your terminal or run: source ~/.bashrc"

# Chargement de NVM (nécessaire pour utiliser nvm dans le Makefile)
load-nvm:
	@echo "Loading NVM..."
	bash -c "source ~/.nvm/nvm.sh && nvm --version"

# Installation de Node.js
install-node: load-nvm
	@echo "Installing Node.js..."
	bash -c "source ~/.nvm/nvm.sh && nvm install $(NODE_VERSION) && nvm use $(NODE_VERSION)"

# Configuration de npm pour éviter les problèmes de permission
configure-npm: install-node
	@echo "Configuring npm to use a user directory..."
	bash -c "source ~/.nvm/nvm.sh && npm config set prefix $$HOME/.npm-global"
	echo 'export PATH="$$HOME/.npm-global/bin:$$PATH"' >> ~/.bashrc
	echo 'export PATH="$$HOME/.npm-global/bin:$$PATH"' >> ~/.zshrc
	. ~/.bashrc || . ~/.zshrc

# Installation d'Angular CLI
install-angular-cli: configure-npm
	@echo "Installing Angular CLI..."
	bash -c "source ~/.nvm/nvm.sh && npm install -g @angular/cli@$(ANGULAR_CLI_VERSION)"

# Installation des dépendances npm
install-dependencies:
	@echo "Installing project dependencies..."
	bash -c "source ~/.nvm/nvm.sh && npm install"

# Démarrage du serveur de développement
serve:
	@echo "Starting Angular development server..."
	bash -c "source ~/.nvm/nvm.sh && ng serve"

# Build du projet
build:
	@echo "Building project..."
	bash -c "source ~/.nvm/nvm.sh && ng build"

# Nettoyage
clean:
	@echo "Cleaning project..."
	rm -rf node_modules package-lock.json dist

# Installation complète
setup: install-nvm install-node configure-npm install-angular-cli install-dependencies
	@echo "Setup complete! You can now run 'make serve' to start the development server."

.PHONY: install-nvm load-nvm install-node configure-npm install-angular-cli install-dependencies serve build clean setup
