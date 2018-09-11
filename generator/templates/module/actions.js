import ethersConnect, { MSGS, EVENT_CHANNEL, event } from './ethersConnect';

export default {
    async connect(ctx) {
        try {
            let oldAddress = ctx.state.address;
            let provider = ethers.provider();
            if (!provider) throw new Error(MSGS.NOT_READY);

            let wallet = ethers.wallet();
            if (!wallet) throw new Error(MSGS.NO_WALLET);
            const address = await ethers.walletAddress();
            const network = await ethers.netName();

            ctx.commit('connected',true);
            ctx.commit('error',null);
            ctx.commit('address',address);
            ctx.commit('user',address);
            ctx.commit('network',network);
            console.log('Eth connected');

            const msg = oldAddress && oldAddress !== address ?
            'Your Ethereum address/user has changed. Please confirm your address and network.' :
            `You are connected to the Ethereum Network. Please confirm your address and network.
             If you change your address, this app will update automatically.`
            alert(msg);

            // Other vuex stores can wait for this
            event.$emit(EVENT_CHANNEL,MSGS.ETHERS_VUEX_READY);

            // now check for .eth address too
            if (await ethers.hasEns()) {
                console.log('Net supports ENS. Checking...');
                ctx.commit('ens',await provider.lookupAddress(address));
                if (ens) {
                    ctx.commit('user',ens);
                }
            }
        }
        catch(err) {
            ctx.dispatch('disconnect',err);
        }
    },
    async disconnect(ctx,err) {
        const oldAddress = ctx.state.address;
        ctx.commit('connected',false);
        ctx.commit('error',err);
        ctx.commit('address','');
        ctx.commit('user','');
        ctx.commit('network','');
        ctx.commit('ens',null);

        const msg = oldAddress ?
        'You have been disconnected from your Ethereum connection. Please check MetaMask, etc.' :
        'You are not connected to an Ethereum node and wallet. Please check MetaMask, etc.'
        alert(msg);

    },
    async logout(ctx) {
        ctx.commit('address','');
        ctx.commit('user','');
        alert('You have been logged out from your Ethereum connection');
    },
    async init(ctx) {
        event.$on(EVENT_CHANNEL, function(msg) {
            console.log('Ethers event received',msg);
            switch(msg) {
                case MSGS.NOT_READY:
                    ctx.dispatch('disconnect');
                    break;
                case MSGS.NO_WALLET:
                    ctx.dispatch('logout');
                    break;
                case MSGS.ACCOUNT_CHANGED:
                    ctx.dispatch('connect');
                    break;
            }
        });
        if (ethers.ready()) await ctx.dispatch('connect');
        else await ctx.dispatch('disconnect');
        ctx.commit('initialized', true);
    }
}
