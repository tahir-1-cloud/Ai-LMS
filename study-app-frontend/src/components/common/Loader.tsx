"use client";

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-12">

      <div className="relative">

        {/* Outer spinner */}
        <div
          className="
            w-14 h-14
            border-4
            border-blue-200
            border-t-blue-800
            rounded-full
            animate-spin
          "
        />

        {/* Inner dot */}
        <div
          className="
            absolute inset-0
            flex items-center justify-center
          "
        >
          <div
            className="
              w-3 h-3
              bg-yellow-400
              rounded-full
              animate-pulse
            "
          />
        </div>

      </div>

    </div>
  );
};

export default Loader;