# Variables
NVM_INSTALL_SCRIPT = https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh
.PHONY: all install_nvm install_node install_angular_cli serve
all: install_nvm install_node install_angular_cli
install_nvm:
		curl -o- $(NVM_INSTALL_SCRIPT) | bash
		@echo "Please restart your terminal or run 'source ~/.bashrc' to load NVM."
install_node:
		nvm install node
		nvm use node
install_angular_cli:
		npm install -g @angular/cli
serve:
		ng serve