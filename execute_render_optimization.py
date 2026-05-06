import asyncio
from direct3d_manifold_integration import optimize_sovereign_render

async def main():
    try:
        print('--- INITIALIZING OMEGA_COMP RENDER ---')
        await optimize_sovereign_render()
        print('◦A Render Successful. Frame committed to Unhero767.')
    except Exception as e:
        print(f'Ex_o Detected: {e}')

if __name__ == "__main__":
    asyncio.run(main())
