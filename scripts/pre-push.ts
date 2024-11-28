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
      title: "Checking lint",
      command: "next lint",
      status: "pending",
    },
    {
      title: "Type checking",
      command: "tsc --noEmit",
      status: "pending",
    },
    {
      title: "Building",
      command: "next build",
      status: "pending",
    },
  ];

  private async executeCommand(command: Command): Promise<void> {
    try {
      console.log(chalk.cyan(`\nExecuting: ${command.title}`));
      execSync(command.command, { stdio: "inherit" });
      command.status = "success";
      console.log(chalk.green(`✓ ${command.title} completed successfully`));
    } catch (error) {
      command.status = "error";
      console.error(chalk.red(`✗ Failed to execute: ${command.title}`));
      throw new Error(`Failed to execute: ${command.title}`);
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

  private async logStatus(): Promise<void> {
    console.clear();
    console.log(chalk.blue("\n🚀 Checks Status:\n"));

    for (const cmd of this.commands) {
      const icon = this.getStatusIcon(cmd.status);
      console.log(`${icon} ${cmd.title}`);
    }
  }

  public async run(): Promise<void> {
    console.log(chalk.blue("\n🔍 Starting pre-push checks..."));

    try {
      for (const command of this.commands) {
        await this.logStatus();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await this.executeCommand(command);
      }

      await this.logStatus();
      console.log(
        chalk.green("\n✅ All checks passed! Continuing with push...")
      );
      process.exit(0);
    } catch (error) {
      await this.logStatus();
      console.error(chalk.red("\n❌ Checks failed. Push cancelled."));
      if (error instanceof Error) {
        console.error(chalk.red(`\nError: ${error.message}`));
      }
      process.exit(1);
    }
  }
}

new PrePushCheck().run();
