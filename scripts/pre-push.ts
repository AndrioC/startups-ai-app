import { ChalkInstance } from "chalk";
import { execSync } from "child_process";

type CommandStatus = "pending" | "success" | "error";

interface Command {
  title: string;
  command: string;
  status: CommandStatus;
}

class PrePushCheck {
  private commands: Command[] = [
    {
      title: "Verificando lint",
      command: "next lint",
      status: "pending",
    },
    {
      title: "Verificando tipos",
      command: "tsc --noEmit",
      status: "pending",
    },
    {
      title: "Gerando build",
      command: "next build",
      status: "pending",
    },
  ];

  private async getChalk(): Promise<ChalkInstance> {
    const { default: chalk } = await import("chalk");
    return chalk;
  }

  private async executeCommand(
    command: Command,
    chalk: ChalkInstance
  ): Promise<void> {
    try {
      console.log(chalk.cyan(`\nExecutando: ${command.title}`));
      execSync(command.command, { stdio: "inherit" });
      command.status = "success";
      console.log(chalk.green(`✓ ${command.title} concluído com sucesso`));
    } catch (error) {
      command.status = "error";
      console.error(chalk.red(`✗ Falha ao executar: ${command.title}`));
      throw new Error(`Falha ao executar: ${command.title}`);
    }
  }

  private getStatusIcon(status: CommandStatus, chalk: ChalkInstance): string {
    switch (status) {
      case "success":
        return chalk.green("✓");
      case "error":
        return chalk.red("✗");
      default:
        return chalk.yellow("○");
    }
  }

  private async logStatus(chalk: ChalkInstance): Promise<void> {
    console.clear();
    console.log(chalk.blue("\n🚀 Status das Verificações:\n"));

    for (const cmd of this.commands) {
      const icon = this.getStatusIcon(cmd.status, chalk);
      console.log(`${icon} ${cmd.title}`);
    }
  }

  public async run(): Promise<void> {
    const chalk = await this.getChalk();
    console.log(chalk.blue("\n🔍 Iniciando verificações pre-push..."));

    try {
      for (const command of this.commands) {
        await this.logStatus(chalk);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await this.executeCommand(command, chalk);
      }

      await this.logStatus(chalk);
      console.log(
        chalk.green(
          "\n✅ Todas as verificações passaram! Continuando com o push..."
        )
      );
      process.exit(0);
    } catch (error) {
      await this.logStatus(chalk);
      console.error(chalk.red("\n❌ Verificações falharam. Push cancelado."));
      if (error instanceof Error) {
        console.error(chalk.red(`\nErro: ${error.message}`));
      }
      process.exit(1);
    }
  }
}

new PrePushCheck().run();
