from magisterium.core import MagisteriumCore


def run_terminal():
    core = MagisteriumCore()
    print("--- Magisterial Terminal Active [Stratum 44] ---")
    while True:
        try:
            user_input = input("[Σ-7] [Magisterium] > ")
            if user_input.lower() in ['exit', 'quit', 'sabbath']:
                print("Enshrinement Protocol initiated. Goodbye.")
                break
            
            is_iron = "--iron" in user_input
            clean_input = user_input.replace("--iron", "").strip()
            
            result = core.verify_logic(clean_input, is_iron_axiom=is_iron)
            print("STATUS: {result}")
        except SystemError as e:
            print("CRITICAL ERROR: {e}")
            break
        except KeyboardInterrupt:
            print("\nManual override: exiting terminal.")
            break

