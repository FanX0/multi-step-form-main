import { useState, useEffect } from "react";
import AppLayout from "./components/layout/AppLayout";
import bgSidebarMobile from "./assets/images/bg-sidebar-mobile.svg";
import bgSidebarDesktop from "./assets/images/bg-sidebar-desktop.svg";
import iconArcade from "./assets/images/icon-arcade.svg";
import iconAdvanced from "./assets/images/icon-advanced.svg";
import iconPro from "./assets/images/icon-pro.svg";

type Billing = "Monthly" | "Yearly";
type PlanId = "Arcade" | "Advanced" | "Pro";
type AddOnId = "Online service" | "Larger storage" | "Customizable profile";

const PLAN_PRICES: Record<Billing, Record<PlanId, number>> = {
  Monthly: {
    Arcade: 9,
    Advanced: 12,
    Pro: 15,
  },
  Yearly: {
    Arcade: 90,
    Advanced: 120,
    Pro: 150,
  },
};

const ADDON_PRICES: Record<Billing, Record<AddOnId, number>> = {
  Monthly: {
    "Online service": 1,
    "Larger storage": 2,
    "Customizable profile": 2,
  },
  Yearly: {
    "Online service": 10,
    "Larger storage": 20,
    "Customizable profile": 20,
  },
};

const App = () => {
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const saved = localStorage.getItem("currentPage");
    return saved ? Number(saved) || 1 : 1;
  });

  const [billing, setBilling] = useState<Billing>(() => {
    const saved = localStorage.getItem("billing");
    return saved === "Monthly" || saved === "Yearly" ? (saved as Billing) : "Monthly";
  });
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(() => {
    const saved = localStorage.getItem("selectedPlan");
    return saved === "Arcade" || saved === "Advanced" || saved === "Pro"
      ? (saved as PlanId)
      : null;
  });
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnId[]>(() => {
    const saved = localStorage.getItem("selectedAddOns");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved) as AddOnId[];
      const valid = parsed.filter(
        (v) =>
          v === "Online service" ||
          v === "Larger storage" ||
          v === "Customizable profile"
      );
      return valid;
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem("billing", billing);
  }, [billing]);

  useEffect(() => {
    if (selectedPlan) {
      localStorage.setItem("selectedPlan", selectedPlan);
    } else {
      localStorage.removeItem("selectedPlan");
    }
  }, [selectedPlan]);

  useEffect(() => {
    localStorage.setItem("selectedAddOns", JSON.stringify(selectedAddOns));
  }, [selectedAddOns]);

  const handleChangePage = (page: number) => {
    if (page < 1 || page > 4) return;
    setCurrentPage(page);
  };

  const handleToggleBilling = () => {
    setBilling((prev) => (prev === "Monthly" ? "Yearly" : "Monthly"));
  };

  const handleSelectPlan = (plan: PlanId) => {
    setSelectedPlan(plan);
  };

  const handleToggleAddOn = (addOn: AddOnId, checked: boolean) => {
    setSelectedAddOns((prev) => {
      if (checked) {
        return prev.includes(addOn) ? prev : [...prev, addOn];
      }
      return prev.filter((item) => item !== addOn);
    });
  };

  const planPrice = selectedPlan ? PLAN_PRICES[billing][selectedPlan] : 0;

  const addOnsTotal = selectedAddOns.reduce((total, addOn) => {
    return total + ADDON_PRICES[billing][addOn];
  }, 0);

  const total = planPrice + addOnsTotal;

  const priceSuffix = billing === "Monthly" ? "/mo" : "/yr";
  const totalLabel = billing === "Monthly" ? "per month" : "per year";

  return (
    <>
      <header className="responsive ">
        <div className="flex items-center justify-center gap-4 my-8">
          <button
            className={`
            ${
              currentPage === 1
                ? "bg-Blue-200 text-black"
                : "border-1 border-white text-white"
            } w-[2rem] h-[2rem] rounded-full`}
            onClick={() => handleChangePage(1)}
          >
            1
          </button>
          <button
            className={`
            ${
              currentPage === 2
                ? "bg-Blue-200 text-black"
                : "border-1 border-white text-white"
            } w-[2rem] h-[2rem] rounded-full`}
            onClick={() => handleChangePage(2)}
          >
            2
          </button>
          <button
            className={`
            ${
              currentPage === 3
                ? "bg-Blue-200 text-black"
                : "border-1 border-white text-white"
            } w-[2rem] h-[2rem] rounded-full`}
            onClick={() => handleChangePage(3)}
          >
            3
          </button>
          <button
            className={`
            ${
              currentPage === 4
                ? "bg-Blue-200 text-black"
                : "border-1 border-white text-white"
            } w-[2rem] h-[2rem] rounded-full`}
            onClick={() => handleChangePage(4)}
          >
            4
          </button>
        </div>
        <picture className="absolute left-0 top-0 w-full h-full z-[-1]">
          <source
            srcSet={bgSidebarMobile}
            type="image/jpeg"
            media="(max-width: 37.5rem)"
          />

          <source
            srcSet={bgSidebarDesktop}
            type="image/jpeg"
            media="(min-width: 102.5rem)"
          />

          <img src={bgSidebarDesktop} alt="background sidebar" className="" />
        </picture>
      </header>

      <AppLayout>
        <div>
          <div>
            {/* Step 1 */}
            <section className={currentPage === 1 ? "" : "hidden"}>
              <form>
                <fieldset className="space-y-4">
                  <legend className="">Personal info</legend>
                  <p className="text-Grey-500 ">
                    Please provide your name, email address, and phone number.
                  </p>
                  <p className="text-blue-950 flex flex-col">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="border-1 border-Grey-500 rounded-md p-2"
                      placeholder="e.g. Stephen King"
                    />
                  </p>
                  <p className="text-blue-950 flex flex-col">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="border-1 border-Grey-500 rounded-md p-2"
                      placeholder="e.g. stephenking@lorem.com"
                    />
                  </p>
                  <p className="text-blue-950 flex flex-col">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      className="border-1 border-Grey-500 rounded-md p-2"
                      placeholder="e.g. +1 234 567 890"
                    />
                  </p>
                </fieldset>
              </form>
            </section>

            {/* Step 2: Plan */}
            <section className={currentPage === 2 ? "" : "hidden"}>
              <form>
                <fieldset className="space-y-4">
                  <legend>Select your plan</legend>
                  <p>You have the option of monthly or yearly billing.</p>

                  <label
                    htmlFor="plan-arcade"
                    className={`flex gap-4 border-1 border-Grey-500 rounded-md px-4 py-3 ${
                      selectedPlan === "Arcade"
                        ? "border-2 border-Purple-600"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      id="plan-arcade"
                      name="plan"
                      value="Arcade"
                      checked={selectedPlan === "Arcade"}
                      onChange={() => handleSelectPlan("Arcade")}
                      className="opacity-0 absolute"
                    />
                    <img src={iconArcade} alt="" />
                    <span className="flex flex-col text-md font-bold text-Blue-950">
                      Arcade
                      <div className="text-Grey-500 font-normal text-sm">
                        ${PLAN_PRICES[billing].Arcade}
                        {priceSuffix}
                      </div>
                      {billing === "Yearly" && <p>2 months free</p>}
                    </span>
                  </label>

                  <label
                    htmlFor="plan-advanced"
                    className={`flex gap-4 border-1 border-Grey-500 rounded-md px-4 py-3 ${
                      selectedPlan === "Advanced"
                        ? "border-2 border-Purple-600"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      id="plan-advanced"
                      name="plan"
                      value="Advanced"
                      checked={selectedPlan === "Advanced"}
                      onChange={() => handleSelectPlan("Advanced")}
                      className="opacity-0 absolute"
                    />
                    <img src={iconAdvanced} alt="" />
                    <span className="flex flex-col text-md font-bold text-Blue-950">
                      Advanced
                      <div className="text-Grey-500 font-normal text-sm">
                        ${PLAN_PRICES[billing].Advanced}
                        {priceSuffix}
                      </div>
                      {billing === "Yearly" && <p>2 months free</p>}
                    </span>
                  </label>

                  <label
                    htmlFor="plan-pro"
                    className={`flex gap-4 border-1 border-Grey-500 rounded-md px-4 py-3 ${
                      selectedPlan === "Pro" ? "border-2 border-Purple-600" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      id="plan-pro"
                      name="plan"
                      value="Pro"
                      checked={selectedPlan === "Pro"}
                      onChange={() => handleSelectPlan("Pro")}
                      className="opacity-0 absolute"
                    />
                    <img src={iconPro} alt="" />
                    <span className="flex flex-col text-md font-bold text-Blue-950">
                      Pro
                      <div className="text-Grey-500 font-normal text-sm">
                        ${PLAN_PRICES[billing].Pro}
                        {priceSuffix}
                      </div>
                      {billing === "Yearly" && <p>2 months free</p>}
                    </span>
                  </label>
                </fieldset>

                <div>
                  <p>Monthly</p>
                  <div className="relative inline-block w-11 h-5">
                    <input
                      id="billing-switch"
                      type="checkbox"
                      onChange={handleToggleBilling}
                      checked={billing === "Yearly"}
                      className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300"
                    />
                    <label
                      htmlFor="billing-switch"
                      className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
                    ></label>
                  </div>
                  <p>Yearly</p>
                </div>
              </form>
            </section>

            <section className={currentPage === 3 ? "" : "hidden"}>
              <form>
                <fieldset>
                  <legend>Add-ons</legend>
                  <p className="text-Grey-500">
                    Add-ons help enhance your gaming experience.
                  </p>

                  <label
                    htmlFor="addon-online"
                    className={`flex flex-row items-center justify-between gap-2 border-1 border-Grey-500 rounded-md px-4 py-3 ${
                      selectedAddOns.includes("Online service")
                        ? "border-2 border-Purple-600"
                        : ""
                    }`}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <input
                        type="checkbox"
                        id="addon-online"
                        name="add-on"
                        value="Online service"
                        checked={selectedAddOns.includes("Online service")}
                        onChange={(e) =>
                          handleToggleAddOn("Online service", e.target.checked)
                        }
                      />
                      <div>
                        <p className="font-bold"> Online service</p>
                        <p className="text-Grey-500 font-normal text-[0.75rem]">
                          Access to multiplayer games
                        </p>
                      </div>
                    </div>
                    <p className="font-normal text-Purple-600 ">
                      +${ADDON_PRICES[billing]["Online service"]}
                      {priceSuffix}
                    </p>
                  </label>

                  <label
                    htmlFor="addon-storage"
                    className={`flex flex-row items-center justify-between gap-2 border-1 border-Grey-500 rounded-md px-4 py-3 ${
                      selectedAddOns.includes("Larger storage")
                        ? "border-2 border-Purple-600"
                        : ""
                    }`}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <input
                        type="checkbox"
                        id="addon-storage"
                        name="add-on"
                        value="Larger storage"
                        checked={selectedAddOns.includes("Larger storage")}
                        onChange={(e) =>
                          handleToggleAddOn("Larger storage", e.target.checked)
                        }
                      />
                      <div>
                        <p className="font-bold">Larger storage</p>
                        <p className="text-Grey-500 font-normal text-[0.75rem]">
                          Extra 1TB of cloud save
                        </p>
                      </div>
                    </div>
                    <p className="font-normal text-Purple-600 ">
                      +${ADDON_PRICES[billing]["Larger storage"]}
                      {priceSuffix}
                    </p>
                  </label>

                  <label
                    htmlFor="addon-profile"
                    className={`flex flex-row items-center justify-between gap-2 border-1 border-Grey-500 rounded-md px-4 py-3 ${
                      selectedAddOns.includes("Customizable profile")
                        ? "border-2 border-Purple-600"
                        : ""
                    }`}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <input
                        type="checkbox"
                        id="addon-profile"
                        name="add-on"
                        value="Customizable profile"
                        checked={selectedAddOns.includes(
                          "Customizable profile"
                        )}
                        onChange={(e) =>
                          handleToggleAddOn(
                            "Customizable profile",
                            e.target.checked
                          )
                        }
                      />
                      <div>
                        <p className="font-bold">Customizable profile</p>
                        <p className="text-Grey-500 font-normal text-[0.75rem]">
                          Customized theme on your site
                        </p>
                      </div>
                    </div>
                    <p className="font-normal text-Purple-600 ">
                      +${ADDON_PRICES[billing]["Customizable profile"]}
                      {priceSuffix}
                    </p>
                  </label>
                </fieldset>
              </form>
            </section>

            {/* Step 4: Summary - Live calculated */}
            <section
              className={`${
                currentPage === 4 ? "" : "hidden"
              } flex flex-col  gap-[1rem]`}
            >
              <h2 className="text-2xl font-bold text-Blue-950">Finishing up</h2>

              {selectedPlan ? (
                <>
                  <p className="text-Grey-500">
                    Double-check everything looks OK before confirming.
                  </p>
                  <div className="bg-Blue-100 rounded-lg px-4 py-3 p-[0.5rem]">
                    <div className="flex flex-row items-center justify-between border-b-1 border-Grey-500 pb-[0.5rem] mb-[0.5rem]">
                      <div>
                        <p className="font-bold">
                          {selectedPlan} <span>({billing})</span>
                        </p>
                        <button
                          className="underline text-Grey-500"
                          onClick={() => handleChangePage(2)}
                        >
                          Change
                        </button>
                      </div>
                      <p className="font-bold text-Blue-950">
                        ${planPrice}
                        {priceSuffix}
                      </p>
                    </div>
                    {selectedAddOns.length > 0 ? (
                      <ul>
                        {selectedAddOns.map((addOn) => (
                          <li
                            key={addOn}
                            className="flex flex-row items-center justify-between"
                          >
                            <p className="text-Grey-500"> {addOn} </p>
                            <p className="font-normal text-Blue-950 ">
                              +${ADDON_PRICES[billing][addOn]}
                              {priceSuffix}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No add-ons selected.</p>
                    )}
                  </div>

                  <div className="p-[1rem] flex justify-between items-center">
                    <p>Total ({totalLabel}):</p>
                    <p className="font-bold text-Purple-600">
                      {" $" + total}
                      {priceSuffix}
                    </p>
                  </div>
                </>
              ) : (
                <p>No plan selected yet.</p>
              )}
            </section>
          </div>

          <footer className="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-between items-center">
            <button
              className={`${
                currentPage === 1 ? "hidden" : ""
              }  text-Grey-500 px-4 py-2 rounded-md`}
              onClick={() => handleChangePage(currentPage - 1)}
            >
              Go Back
            </button>

            <button
              onClick={() => handleChangePage(currentPage + 1)}
              className={`${
                currentPage === 1 ? "ml-auto" : ""
              } bg-Blue-950 text-white px-4 py-2 rounded-md`}
            >
              {currentPage === 4 ? "Confirm" : "Next Step"}
            </button>
          </footer>
        </div>
      </AppLayout>
    </>
  );
};

export default App;
