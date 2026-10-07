import { Layers } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import warehouse from "../assets/imgs/warehouse.png";

const Landing = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "reymark" && password === "1234") {
      navigate("/dashboard");
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white text-[#172b32] lg:grid lg:grid-cols-2">
      <section 
        className="min-h-screen bg-[#172b32] px-5 py-8 text-white sm:px-8 lg:px-10 lg:py-12 xl:px-16 flex justify-center items-center lg:items-start lg:justify-end">
        <div className=" flex w-full max-w-155 flex-col items-center">
          <header className="flex items-center gap-2 text-xl font-medium sm:text-2xl lg:text-3xl w-full">
            <Layers
              aria-hidden="true"
              className="size-6 shrink-0 text-[#f0b982] lg:size-8"
            />
            <span>stockroom</span>
          </header>

          <div className="mt-20 flex w-full flex-col items-center sm:mt-24 lg:mt-28">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#c2c1c1] sm:text-sm w-full">
              YOUR WORKSPACE, CONNECTED
            </p>

            <h1 className="mt-5 w-full text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Everything in its place.
            </h1>

            <p className="mt-5 w-full text-sm leading-7 text-[#c2c1c1] sm:text-base">
              One workspace for your inventory, deliveries, and the people who
              keep things moving.
            </p>

            <div className="mt-10 w-full overflow-hidden rounded-2xl sm:mt-14">
              <img
                src={warehouse}
                alt="Organized warehouse shelves"
                className="block aspect-[16/10] w-full object-cover"
                draggable="false"
              />
            </div>
          </div>

          <p className="mt-16 text-[10px] w-full font-medium tracking-[0.16em] text-[#c2c1c1] sm:text-xs">
            STOCKROOM / INVENTORY MANAGEMENT
          </p>
        </div>
      </section>
        
      <section className="min-h-screen px-5 py-16 sm:px-8 flex justify-center items-center lg:justify-start lg:items-start lg:px-12 lg:py-24 xl:px-20">
        <div className="w-full max-w-[520px] flex flex-col items-center lg:py-30">
          <div className="mb-9 space-y-3 sm:mb-11 w-full">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500 sm:text-base">
              Log in to access your inventory workspace
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 w-full">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-[#505050] sm:text-base"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Enter your username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="h-14 w-full rounded-xl border border-gray-300 px-4 text-base outline-none transition focus:border-[#127f74] focus:ring-4 focus:ring-[#127f74]/10"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#505050] sm:text-base"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-14 w-full rounded-xl border border-gray-300 px-4 text-base outline-none transition focus:border-[#127f74] focus:ring-4 focus:ring-[#127f74]/10"
              />
            </div>

            <button
              type="submit"
              className="h-14 w-full rounded-xl bg-[#127f74] font-semibold text-white transition hover:bg-[#0e6d64] focus:outline-none focus:ring-4 focus:ring-[#127f74]/20 active:scale-[0.99] cursor-pointer"
            >
              Log in
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-500">
            Use the credentials provided by your administrator.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Landing;