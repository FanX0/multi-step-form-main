import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("Multi-step form end-to-end (Vitest)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

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

  test("Confirm shows Thank you regardless of add-ons", async () => {
    const user = userEvent.setup();

    render(<App />);

    // Step 1 -> Step 2
    await user.click(screen.getByRole("button", { name: /next step/i }));

    // Pick a plan
    await user.click(screen.getByRole("radio", { name: /arcade/i }));

    // Step 2 -> Step 3
    await user.click(screen.getByRole("button", { name: /next step/i }));

    // Select at least one add-on (to ensure previous logic won't block thank-you)
    await user.click(screen.getByRole("checkbox", { name: /online service/i }));

    // Step 3 -> Step 4
    await user.click(screen.getByRole("button", { name: /next step/i }));

    // Confirm
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    // Expect Thank you screen
    expect(screen.getByRole("heading", { name: /thank you/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /finishing up/i })).not.toBeInTheDocument();
  });

  test("Go Back navigates to previous step and updates localStorage", async () => {
    const user = userEvent.setup();

    render(<App />);

    // Step 1 -> Step 2
    await user.click(screen.getByRole("button", { name: /next step/i }));
    // Pick a plan to allow progression
    await user.click(screen.getByRole("radio", { name: /arcade/i }));
    // Step 2 -> Step 3
    await user.click(screen.getByRole("button", { name: /next step/i }));

    // Go Back to Step 2
    await user.click(screen.getByRole("button", { name: /go back/i }));
    expect(screen.getByText(/select your plan/i)).toBeInTheDocument();
    expect(localStorage.getItem("currentPage")).toBe("2");

    // Go Back to Step 1
    await user.click(screen.getByRole("button", { name: /go back/i }));
    expect(screen.getByText(/personal info/i)).toBeInTheDocument();
    expect(localStorage.getItem("currentPage")).toBe("1");
  });

  test("Desktop sidebar navigation buttons jump to target step", async () => {
    const user = userEvent.setup();

    render(<App />);

    // Use the <nav> area to click step 4 directly
    const nav = screen.getByRole("navigation");
    const step4Btn = within(nav).getByRole("button", { name: /summary/i });
    await user.click(step4Btn);

    // We jumped to step 4 without a selected plan
    expect(screen.getByText(/no plan selected yet\./i)).toBeInTheDocument();
    expect(localStorage.getItem("currentPage")).toBe("4");
  });
});
