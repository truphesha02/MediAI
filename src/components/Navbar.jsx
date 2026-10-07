import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

        {/* LOGO */}

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >

          <span className="text-3xl">
            🩺
          </span>

          <h1 className="text-2xl font-bold text-blue-700">
            MediAI
          </h1>

        </div>


        {/* NAVIGATION */}

        <ul className="flex gap-8 font-medium items-center">

          <li
            onClick={() => navigate("/")}
            className="cursor-pointer hover:text-blue-600 transition"
          >
            Home
          </li>


          <li
            onClick={() => {
              document
                .getElementById("features")
                ?.scrollIntoView({
                  behavior: "smooth"
                });
            }}
            className="cursor-pointer hover:text-blue-600 transition"
          >
            Features
          </li>


          <li
            onClick={() => {
              document
                .getElementById("about")
                ?.scrollIntoView({
                  behavior: "smooth"
                });
            }}
            className="cursor-pointer hover:text-blue-600 transition"
          >
            About
          </li>


          <li
            onClick={() => {
              document
                .getElementById("contact")
                ?.scrollIntoView({
                  behavior: "smooth"
                });
            }}
            className="cursor-pointer hover:text-blue-600 transition"
          >
            Contact
          </li>


          {/* DASHBOARD */}

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Dashboard
          </button>

        </ul>

      </div>

    </nav>
  );
}

export default Navbar;