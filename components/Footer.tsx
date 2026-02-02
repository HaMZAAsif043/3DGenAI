export default function Footer() {
    return (
        <footer className="bg-zinc-950 border-t border-zinc-800 py-24 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
                <div className="grid md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-2">
                        <img
                            src="/Gen3DAI_logo_2.png"
                            alt="Gen3DAI Logo"
                            className="h-14 w-auto mb-8 brightness-[10] contrast-[100]"
                        />
                        <p className="text-zinc-400 text-sm max-w-sm leading-relaxed font-medium">
                            Empowering creators with production-grade AI 3D generation. Turn any vision into a realized asset in physical space.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8">Platform</h4>
                        <ul className="space-y-4 text-sm text-zinc-400 font-medium">
                            <li><a href="/dashboard/upload" className="hover:text-white transition-colors">Engine v2.0</a></li>
                            <li><a href="/#showcase" className="hover:text-white transition-colors">Model Gallery</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8">Company</h4>
                        <ul className="space-y-4 text-sm text-zinc-400 font-medium">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Protocol</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Access</a></li>
                            <li><a href="mailto:contact@gen3dai.com" className="hover:text-white transition-colors">Support Center</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                    <p>© 2026 GEN3DAI. CORPORATE ENTITY.</p>
                    <p>ENGINEERED BY TENCENT HUNYUAN3D</p>
                </div>
            </div>
        </footer>
    );
}
