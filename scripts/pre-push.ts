import chalk from "chalk";
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

  private executeCommand(command: Command): void {
    try {
      execSync(command.command, { stdio: "inherit" });
      command.status = "success";
    } catch (error) {
      command.status = "error";
      throw new Error(`Falha ao executar: ${command.title}`);
    }
  }

  private getStatusIcon(status: CommandStatus): string {
    switch (status) {
      case "success":
        return chalk.green("✓");
      case "error":
        return chalk.red("✗");
      default:
        return chalk.yellow("○");
    }
  }

  private logStatus(): void {
    console.clear();
    console.log(chalk.blue("\n🚀 Status das Verificações:\n"));

    this.commands.forEach((cmd) => {
      const icon = this.getStatusIcon(cmd.status);
      console.log(`${icon} ${cmd.title}`);
    });
  }

  public async run(): Promise<void> {
    console.log(chalk.blue("\n🔍 Iniciando verificações pre-push..."));

    try {
      for (const command of this.commands) {
        this.logStatus();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.executeCommand(command);
      }

      this.logStatus();
      console.log(
        chalk.green(
          "\n✅ Todas as verificações passaram! Continuando com o push..."
        )
      );
      process.exit(0);
    } catch (error) {
      this.logStatus();
      console.error(chalk.red("\n❌ Verificações falharam. Push cancelado."));
      if (error instanceof Error) {
        console.error(chalk.red(`\nErro: ${error.message}`));
      }
      process.exit(1);
    }
  }
}

new PrePushCheck().run();
