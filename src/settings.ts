import CopilotPlugin from "@/main";
import { App, PluginSettingTab, Setting, DropdownComponent } from "obsidian";

export class CopilotSettingTab extends PluginSettingTab {
  plugin: CopilotPlugin;

  constructor(app: App, plugin: CopilotPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();
    containerEl.createEl('h2', {text: 'Obsidian Copilot Settings'});
    containerEl.createEl('h4', {text: 'OpenAI API Settings'});

    new Setting(containerEl)
      .setName("Your OpenAI API key")
      .setDesc(
        createFragment((frag) => {
					frag.appendText("You can find your API key at ");
					frag.createEl('a', {
            text: "https://beta.openai.com/account/api-keys",
            href: "https://beta.openai.com/account/api-keys"
          });
          frag.createEl('br');
          frag.appendText("It is stored locally in your vault, and is only used to make requests to OpenAI.");
				})
      )
      .addText((text) =>{
        text.inputEl.type = "password";
        text.inputEl.style.width = "80%";
        text
          .setPlaceholder("OpenAI API key")
          .setValue(this.plugin.settings.openAiApiKey)
          .onChange(async (value) => {
            this.plugin.settings.openAiApiKey = value;
            await this.plugin.saveSettings();
          })
        }
      );

    new Setting(containerEl)
      .setName("Default Model")
      .setDesc(
        createFragment((frag) => {
					frag.appendText("The default model to use, only takes effect when you ");
					frag.createEl('strong', {text: "restart the plugin"});
				})
      )
      .addDropdown((dropdown: DropdownComponent) => {
        dropdown
          .addOption('gpt-3.5-turbo', 'GPT-3.5')
          .addOption('gpt-4', 'GPT-4')
          .setValue(this.plugin.settings.defaultModel)
          .onChange(async (value: string) => {
            this.plugin.settings.defaultModel = value;
            await this.plugin.saveSettings();
          });
      });

    containerEl.createEl(
      'h6',
      {
        text: 'Please be mindful of the number of tokens and context conversation turns you set here, as they will affect the cost of your API requests.'
      }
    );

    new Setting(containerEl)
      .setName("Temperature")
      .setDesc(
        createFragment((frag) => {
					frag.appendText(
            "Default is 0.7. Higher values will result in more creativeness, but also more mistakes. Set to 0 for no randomness."
          );
				})
      )
      .addText((text) =>{
        text.inputEl.type = "number";
        text
          .setPlaceholder("0.7")
          .setValue(this.plugin.settings.temperature)
          .onChange(async (value) => {
            this.plugin.settings.temperature = value;
            await this.plugin.saveSettings();
          })
        }
      );

    new Setting(containerEl)
      .setName("Token limit")
      .setDesc(
        createFragment((frag) => {
					frag.appendText(
            "The maximum number of tokens to generate. Default is 1000."
          );
				})
      )
      .addText((text) =>{
        text.inputEl.type = "number";
        text
          .setPlaceholder("1000")
          .setValue(this.plugin.settings.maxTokens)
          .onChange(async (value) => {
            this.plugin.settings.maxTokens = value;
            await this.plugin.saveSettings();
          })
        }
      );

    new Setting(containerEl)
      .setName("Conversation turns in context")
      .setDesc(
        createFragment((frag) => {
					frag.appendText(
            "The number of previous conversation turns to include in the context. Default is 3 turns, i.e. 6 messages."
          );
				})
      )
      .addText((text) =>{
        text.inputEl.type = "number";
        text
          .setPlaceholder("3")
          .setValue(this.plugin.settings.contextTurns)
          .onChange(async (value) => {
            this.plugin.settings.contextTurns = value;
            await this.plugin.saveSettings();
          })
        }
      );
  }
}