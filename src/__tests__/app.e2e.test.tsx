import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("Multi-step form end-to-end (Vitest)", () => {
  test("Full flow: select plan, toggle billing, add-ons, summary and localStorage", async () => {
    const user = userEvent.setup();

    render(<App />);

    const nextStepBtn = screen.getByRole("button", { name: /next step/i });
    await user.click(nextStepBtn);

    const arcadeRadio = screen.getByRole("radio", { name: /arcade/i });
    await user.click(arcadeRadio);

    const billingSwitch = screen.getAllByRole("checkbox")[0];
    await user.click(billingSwitch);

    const nextStepBtn2 = screen.getByRole("button", { name: /next step/i });
    await user.click(nextStepBtn2);

    const onlineService = screen.getByRole("checkbox", {
      name: /online service/i,
    });
    const largerStorage = screen.getByRole("checkbox", {
      name: /larger storage/i,
    });
    await user.click(onlineService);
    await user.click(largerStorage);

    const nextStepBtn3 = screen.getByRole("button", { name: /next step/i });
    await user.click(nextStepBtn3);

    const summaryHeading = screen.getByRole("heading", {
      name: /finishing up/i,
    });
    expect(summaryHeading).toBeInTheDocument();
    const summarySection = summaryHeading.closest("section") as HTMLElement;
    expect(summarySection).toBeTruthy();

    expect(within(summarySection).getByText(/\$90\/yr/i)).toBeInTheDocument();
    expect(within(summarySection).getByText(/\+\$10\/yr/i)).toBeInTheDocument();
    expect(within(summarySection).getByText(/\+\$20\/yr/i)).toBeInTheDocument();
    expect(within(summarySection).getByText(/\$120\/yr/i)).toBeInTheDocument();

    expect(localStorage.getItem("billing")).toBe("Yearly");
    expect(localStorage.getItem("selectedPlan")).toBe("Arcade");
    expect(localStorage.getItem("selectedAddOns")).toBe(
      JSON.stringify(["Online service", "Larger storage"])
    );
    expect(localStorage.getItem("currentPage")).toBe("4");
  });
});
