# openDAW-lib

The library `openDAW-lib` is a practical TypeScript standard library built specifically for
the [openDAW](https://github.com/andremichelle/openDAW) project. Its purpose is to provide reusable utilities,
abstractions, and tools to streamline development across technical domains such as audio processing, runtime utilities,
and web-based functionality.

---

### Libraries

#### `box`

The `box` folder includes its own `src` directory and configuration files, suggesting it contains essential abstractions
or utilities. It may define basic structures or helpers that other parts of the library depend on for data organization
or functionality.

#### `box-forge`

The `box-forge` folder appears to extend or complement the `box` module, containing both source code and a `test`
directory. This likely suggests additional tools for utilizing or testing features defined in the `box` module,
providing more advanced or scenario-specific utilities.

#### `dom`

This folder contains source files that likely focus on utility functions for interacting with the browser's Document
Object Model (DOM). It enables streamlined manipulation of web elements and handling of events, essential for
browser-oriented features.

#### `dsp`

The `dsp` folder includes tools related to Digital Signal Processing, crucial for managing audio data. Functions here
could include audio effects, filters, and transformations that make `opendaw-lib` suitable for sound-related projects.

#### `runtime`

The `runtime` folder likely handles utilities that assist in the optimization or management of runtime environments,
such as platform-specific settings, process configurations, or environment checks for seamless execution.

#### `std`

Providing general-purpose utility functions, the `std` folder likely contains tools for common programming tasks such as
error handling, array manipulations, and other fundamental operations widely used across the library.

#### `tsx`

The `tsx` folder most likely focuses on helpers related to rendering TSX/JSX-based components. It might offer
abstractions to simplify UI development, making it easier to create dynamic frontend applications within web
environments.

These folders showcase the modular design and multi-purpose nature of `opendaw-lib`, enabling it to handle a wide range
of requirements, from frontend utilities to complex digital signal processing.

---

## Contributing

Bug reports, feature requests, and pull-requests are welcome!
Please make sure `npm test` passes and follow the existing code-style.

---

#### Shell Scripts

The project includes the following two shell scripts in its root directory:

1. **`clean.sh`**:
    - Purpose: Likely used to remove temporary files, built assets, or other intermediate files generated during
      development or building processes.
    - Common tasks could include:
        - Deleting compiled JavaScript or TypeScript files (`.js`, `.js.map`).
        - Clearing cache or temporary build directories.
        - Cleaning `node_modules` or resetting dependencies in some cases.

    - This ensures the development environment is in a "clean slate" state, free from residual or outdated files.

2. **`rebuild.sh`**:
    - Purpose: Likely combines the steps of cleaning and rebuilding the library.
    - Typical operations:
        - Calls . `clean.sh`
        - Triggers the build pipeline (e.g., via `npm run build`, `tsc`, or another build tool like `vite` or `tsup`).
        - Prepares the library for use, production, or distribution by ensuring all code is up to date and correctly
          built.

---

## License

[GPL v3](https://www.gnu.org/licenses/gpl-3.0.txt) © 2025 André Michelle

## Dual-Licensing Model

openDAW is available **under two alternative license terms**:

| Option                    | When to choose it                                                                                              | Obligations                                                                                                                                                                      |
|---------------------------|----------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **A. GPL v3 (or later)**  | You are happy for the entire work that includes openDAW to be released under GPL-compatible open-source terms. | – Must distribute complete corresponding source code under GPL.<br>– Must keep copyright & licence notices.<br>– May run openDAW privately in any software, open or closed (§0). |
| **B. Commercial Licence** | You wish to incorporate openDAW into **closed-source** or otherwise licence-incompatible software.             | – Pay the agreed fee.<br>– No copyleft requirement for your own source code.<br>– Other terms as per the signed agreement.                                                       |

> **How to obtain the Commercial License**  
> Email `andre.michelle@opendaw.org` with your company name, product description, and expected distribution volume.

If you redistribute openDAW or a derivative work **without** a commercial license, the GPL v3 terms apply automatically.