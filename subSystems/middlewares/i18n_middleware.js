/**
 * MIDDLEWARE: i18n PACKET STAMP
 */
const I18nMiddleware = (() => {
    const enrich = async (packet) => {
        const config = window.I18nFactory.getConfig();
        
        if (config) {
            // Stamp the packet with the active language metadata
            packet.metadata.lang = config.meta.langCode;
            // Provide the lexicon to the packet so downstream logic can use it instantly
            packet.metadata.lexicon = config.lexicon;
        }

        return packet;
    };

    // Auto-Register at the START of the enrichment chain
    if (window.VentMiddleware) {
        window.VentMiddleware.registerModule(enrich);
    }

    return { enrich };
})();