(function () {
  const knowledge = window.UDAANSETU_KNOWLEDGE || {};

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function capitalize(value) {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  }

  function getUserTypeFromText(text) {
    const members = knowledge.userTypes || [];
    for (let i = 0; i < members.length; i += 1) {
      const type = members[i];
      if (text.includes(type)) {
        return type;
      }
    }
    return "";
  }

  class UdaanSetuChatEngine {
    constructor() {
      this.defaultSuggestions = [
        "What is UdaanSetu?",
        "How does it work?",
        "I'm a producer",
        "How can I access finance?",
        "How does market linkage work?",
        "Who can partner with UdaanSetu?"
      ];
      this.lastIntent = "";
      this.sessionContext = {
        userType: "",
        lastTopic: "",
        recentTopics: []
      };
      this.knownIntents = [
        "GREETING", "CASUAL_CONVERSATION", "WHO_ARE_YOU", "WHAT_IS_UDAANSETU", "WHY_UDAANSETU", "PROBLEM", "SOLUTION",
        "LIVELIHOOD_ECOSYSTEM", "TARGET_USERS", "PRODUCERS", "SHG", "FPO", "ARTISANS", "ENTREPRENEURS", "MSMES",
        "BUYERS", "MARKETS", "INSTITUTIONS", "GOVERNMENT", "NGOS", "BANKS", "TRAINING_INSTITUTES", "CSR", "PARTNERS",
        "UNIFIED_PROFILE", "UNIFIED_IDENTITY", "END_TO_END_JOURNEY", "DISCOVERY", "MATCHING", "ONBOARDING", "TRAINING",
        "SKILLING", "MENTORING", "CERTIFICATION", "FINANCE", "CREDIT", "INSURANCE", "REGISTRATION", "COMPLIANCE",
        "PACKAGING", "LOGISTICS", "MARKET_LINKAGE", "BUYER_CONNECTION", "ENTERPRISE_GROWTH", "SUPPORT_SERVICES",
        "ECOSYSTEM_ORCHESTRATION", "MONITORING", "CONTINUITY", "PARTNER_COLLABORATION", "DASHBOARD", "DATA",
        "DIGITAL_INFRASTRUCTURE", "ROADMAP", "PILOT", "DISTRICT_EXPANSION", "STATE_EXPANSION", "ECOSYSTEM_INTEGRATION",
        "NATIONAL_ROLLOUT", "IMPACT", "BUSINESS_MODEL", "REVENUE", "MARKETPLACE", "SUBSCRIPTION", "FINANCIAL_SERVICES",
        "CSR_PROGRAMS", "DATA_ANALYTICS", "AI", "FUNDING", "INVESTMENT", "USE_OF_FUNDS", "PROJECTIONS", "PARTNERSHIP",
        "CONTACT", "GENERAL_ENQUIRY", "UNKNOWN"
      ];
    }

    getSessionContext() {
      return this.sessionContext;
    }

    setSessionContext(nextContext) {
      this.sessionContext = {
        ...this.sessionContext,
        ...nextContext
      };
    }

    normalize(text) {
      return String(text || "")
        .toLowerCase()
        .replace(/udaan[-\s]*setu|udaansetu|udansetuu|udaan sethu|udaan setu/g, "udaan setu ")
        .replace(/finace|financing|trainning|market acess|producerr|goverment|organis|organize|certifcation|compliancee/g, (match) => {
          const aliasMap = {
            finance: "finance",
            financing: "finance",
            trainning: "training",
            "market acess": "market access",
            producerr: "producer",
            goverment: "government",
            organis: "organise",
            organize: "organize",
            certifcation: "certification",
            compliancee: "compliance"
          };
          return aliasMap[match] || match;
        })
        .replace(/[^a-z0-9\s\u0900-\u097f]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    detectIntent(input) {
      const text = this.normalize(input);
      if (!text) return "UNKNOWN";

      if (/(hi|hello|hey|namaste|good morning|good evening|good afternoon|hey there)/.test(text)) return "GREETING";
      if (/(thanks|thank you|thankyou|ok|okay|great|nice|perfect)/.test(text)) return "CASUAL_CONVERSATION";
      if (/(who are you|what can you do|who are u|what do you do|what can this do)/.test(text)) return "WHO_ARE_YOU";
      if (/(what is udaan setu|udaan setu kya hai|what is udaansetu|about udaan setu|what is this platform)/.test(text)) return "WHAT_IS_UDAANSETU";
      if (/(why udaan setu|why does it exist|why udaan|what problem|what is the problem|why the platform)/.test(text)) return "WHY_UDAANSETU";
      if (/(problem|fragmented|disconnected|repeated information|difficult access|slow compliance|weak market access|navigating ecosystem)/.test(text)) return "PROBLEM";
      if (/(solution|how does it help|how do you solve|what makes it different|connective layer|work as one)/.test(text)) return "SOLUTION";
      if (/(livelihood ecosystem|ecosystem|one platform|connected ecosystem|institution|services|support)/.test(text)) return "LIVELIHOOD_ECOSYSTEM";
      if (/(who can use|who is it for|for whom|is it for|target users|audience|users)/.test(text)) return "TARGET_USERS";
      if (/(producer|i am a producer|producer benefits|producers)/.test(text)) return "PRODUCERS";
      if (/(shg|self help group|self-help group|women group)/.test(text)) return "SHG";
      if (/(fpo|farmer producer organization|farmer producer company)/.test(text)) return "FPO";
      if (/(artisan|craftsman|weaver)/.test(text)) return "ARTISANS";
      if (/(entrepreneur|startup|small business)/.test(text)) return "ENTREPRENEURS";
      if (/(msme|small medium enterprise|micro small medium)/.test(text)) return "MSMES";
      if (/(buyer|buyers|sourcing|purchase|procurement)/.test(text)) return "BUYERS";
      if (/(market access|market linkage|market|linkage)/.test(text)) return "MARKET_LINKAGE";
      if (/(institution|government|ngo|csr|bank|training institute|insurance|logistics|service provider|partner)/.test(text)) return "PARTNERS";
      if (/(unified profile|one profile|single profile|verified profile|same information again)/.test(text)) return "UNIFIED_PROFILE";
      if (/(unified identity|digital identity|one identity)/.test(text)) return "UNIFIED_IDENTITY";
      if (/(journey|join and assess|discover and skill|finance and setup|link and grow|end to end)/.test(text)) return "END_TO_END_JOURNEY";
      if (/(discover|matching|opportunity|find nearby|recommend|match)/.test(text)) return "DISCOVERY";
      if (/(training|skill|mentoring|certification|upskill|skilling)/.test(text)) return "TRAINING";
      if (/(finance|funding|credit|lending|loan|banking|financial services|embedded services|payment gateway)/.test(text)) return "FINANCE";
      if (/(credit|loan approval|lender|nbfc)/.test(text)) return "CREDIT";
      if (/(insurance|insurer|coverage)/.test(text)) return "INSURANCE";
      if (/(registration|compliance|documentation|legal|govt registration)/.test(text)) return "REGISTRATION";
      if (/(packaging|logistics|transport|delivery|fulfillment)/.test(text)) return "LOGISTICS";
      if (/(buyer connection|connect with buyers|find buyers|sell to buyers|enterprise)/.test(text)) return "BUYER_CONNECTION";
      if (/(partnership|partner with|who can partner|collaborate|ecosystem partner)/.test(text)) return "PARTNER_COLLABORATION";
      if (/(pilot|district|state expansion|ecosystem integration|national rollout|roadmap|year 1|year 2|year 3|year 4|year 5)/.test(text)) return "ROADMAP";
      if (/(impact|jobs supported|household income|10m|500 institutional|2m market linkages|five year vision)/.test(text)) return "IMPACT";
      if (/(business model|revenue model|projected revenue|how money works|marketplace commission|subscription|ai premium|training certification)/.test(text)) return "BUSINESS_MODEL";
      if (/(funding|investment|use of funds|where is the money going|what is the allocation)/.test(text)) return "FUNDING";
      if (/(contact|phone|email|address|how to reach|get in touch)/.test(text)) return "CONTACT";
      if (/(how does it work|how does udaan setu work|how does it operate|process)/.test(text)) return "END_TO_END_JOURNEY";
      if (/(what is the problem|what problem does it solve|why is this needed)/.test(text)) return "PROBLEM";
      if (/(is udaan setu available|everywhere|nationwide|district)/.test(text)) return "ROADMAP";
      if (/(government scheme|govt scheme|government program|scheme)/.test(text)) return "GOVERNMENT";
      if (/(i am an artisan|i am a shg|i am an entrepreneur|i am a buyer|i am a producer|i am an msme|main producer hoon|main shg hoon)/.test(text)) return "TARGET_USERS";
      if (/(kya|kaise|mujhe|main|loan kaise|buyer kaise|market access kaise|government scheme kaise|producer hoon|shg hoon)/.test(text)) return "GENERAL_ENQUIRY";

      if (/(it|this|platform|that)/.test(text) && (this.sessionContext.lastTopic || this.lastIntent)) {
        return this.lastIntent || this.sessionContext.lastTopic || "TARGET_USERS";
      }

      return "UNKNOWN";
    }

    getResponseText(intent, userType) {
      const brand = (knowledge.brand && knowledge.brand.identity) || "UdaanSetu";
      const profileLine = userType ? `UdaanSetu is designed to help ${capitalize(userType)}s connect with training, services, finance, logistics, buyers, and market opportunities through a unified journey.` : "";

      const responseMap = {
        GREETING: "Hi! I'm the UdaanSetu Assistant. I can help you understand how UdaanSetu connects livelihoods with training, finance, market access, services, and growth.",
        CASUAL_CONVERSATION: "Happy to help. I can explain how UdaanSetu connects people, institutions, and services across the livelihood journey.",
        WHO_ARE_YOU: "I'm UdaanSetu's website assistant. I use the information available about UdaanSetu to help answer common questions about the platform, its ecosystem, and the support journey.",
        WHAT_IS_UDAANSETU: `UdaanSetu is ${brand}. It connects producers, entrepreneurs, institutions, services, buyers, and markets through one coordinated livelihood ecosystem.`,
        WHY_UDAANSETU: "The real challenge is not starting — it is navigating the ecosystem. UdaanSetu is designed to reduce fragmentation so users can move from discovery and training to finance, setup, and market access with less repetition and more continuity.",
        PROBLEM: "The livelihood ecosystem is often fragmented across training providers, banks, government offices, service networks, logistics, and buyers. UdaanSetu is designed to connect those pieces into a more continuous journey.",
        SOLUTION: "UdaanSetu acts as a connective layer rather than another isolated service. It aims to bring together identity, discovery, financing, training, compliance, logistics, and market access into one platform experience.",
        LIVELIHOOD_ECOSYSTEM: "UdaanSetu brings together people, institutions, services, and markets as part of an integrated livelihood ecosystem. The goal is to make support, coordination, and access easier across the full journey.",
        TARGET_USERS: "The ecosystem is designed for producers, traders, SHGs, FPOs, artisans, entrepreneurs, and MSMEs, while also connecting institutions such as government bodies, banks, NGOs, training institutes, buyers, and service providers.",
        PRODUCERS: "UdaanSetu is designed to connect producers with opportunity discovery, training, finance, registration support, logistics, buyer access, and market linkage as they build and grow their livelihood.",
        SHG: "For SHGs, the platform aims to support coordinated access to training, services, finance, institutional support, and market opportunities through a more connected ecosystem.",
        FPO: "For FPOs, UdaanSetu is positioned to help strengthen value chains by connecting members with opportunity discovery, services, institutional support, and market linkages.",
        ARTISANS: "For artisans, UdaanSetu can help connect training, mentoring, finance, market access, and buyer opportunities in a way that supports livelihoods and enterprise growth.",
        ENTREPRENEURS: "For entrepreneurs, UdaanSetu can help connect operational support, training, funding access, services, and market opportunities as they scale.",
        MSMES: "For MSMEs, the platform is designed to connect business-building support across skills, services, financing, compliance, logistics, and market access.",
        BUYERS: "UdaanSetu can help buyers and enterprises connect with relevant producers, supply chains, and market opportunities in a more coordinated way.",
        MARKETS: "The platform aims to improve market linkage by connecting producers and buyers through discovery, matching, and continued coordination along the livelihood journey.",
        INSTITUTIONS: "UdaanSetu is designed to bring institutions and ecosystem partners together around a common support journey, reducing duplication and improving coordination.",
        GOVERNMENT: "UdaanSetu is designed to help users discover and access government programs and services as part of a connected livelihood journey. Specific scheme availability and eligibility should be confirmed through the relevant program or institution.",
        NGOS: "NGOs can participate in the ecosystem by supporting training, onboarding, mentoring, service delivery, and local coordination within the livelihood journey.",
        BANKS: "Banks and financial institutions can participate through funding access, financial services, documentation support, and partnership pathways aligned with user needs.",
        TRAINING_INSTITUTES: "Training institutions can help connect skills, mentoring, and certification to opportunities, finance, and market outcomes through the broader UdaanSetu journey.",
        CSR: "CSR organizations can contribute to livelihoods by supporting ecosystem services, training, enterprise growth, and demand-side coordination.",
        PARTNERS: "UdaanSetu's ecosystem is designed to involve government, banks, NGOs, CSR organizations, training institutes, buyers, logistics providers, insurers, and other businesses. I do not have verified information about specific confirmed partners.",
        UNIFIED_PROFILE: "Users can have one verified profile across the ecosystem to capture goals, skills, location, and needs. This reduces repeated information and helps each step in the journey feel connected.",
        UNIFIED_IDENTITY: "A unified identity helps reduce repeated onboarding and makes it easier for actors across the ecosystem to understand who the user is, what they need, and what support is relevant.",
        END_TO_END_JOURNEY: "UdaanSetu connects the journey from beginning to growth: 1) Join & Assess 2) Discover & Skill 3) Finance & Setup 4) Link & Grow. The goal is to reduce fragmentation so people don't need to navigate disconnected systems one by one.",
        DISCOVERY: "The discovery layer is designed to help people find relevant livelihood options, nearby opportunities, training, and service partners based on goals, location, and needs.",
        MATCHING: "Matching is intended to help connect users with the most relevant opportunities, support services, institutions, and buyers in a more organized way.",
        ONBOARDING: "Onboarding focuses on building a profile, understanding needs, and establishing a clear starting point for the support journey.",
        TRAINING: "UdaanSetu connects users with training, mentoring, and certification while aiming to connect skills with the next steps toward livelihood and income.",
        SKILLING: "The platform is designed to connect skills with opportunities, services, and livelihoods so that learning leads toward practical outcome and growth.",
        MENTORING: "Mentoring can support skill conversion, confidence, and more informed decision-making as people move through the livelihood journey.",
        CERTIFICATION: "Certification can help strengthen recognition and trust as users access training, support services, and economic opportunities.",
        FINANCE: "UdaanSetu is designed to connect users with financial partners and services, including banks, NBFCs, insurers, and embedded financial support. The platform itself is not a direct lender.",
        CREDIT: "UdaanSetu is designed to connect eligible users with financial partners and services. The deck does not state that UdaanSetu itself directly issues loans or guarantees approval.",
        INSURANCE: "Insurance can be part of the support layer in a livelihood journey, helping users protect operations and manage risk while they build and grow.",
        REGISTRATION: "Registration and compliance support can help users navigate the documentation and formal steps needed to start or strengthen a livelihood activity.",
        COMPLIANCE: "Compliance support is part of connecting small enterprises and producers with the documentation and processes needed to work more smoothly across institutions and markets.",
        PACKAGING: "Packaging support can help improve readiness for market engagement, product quality, and presentation as users prepare for buyers and sales.",
        LOGISTICS: "Logistics is part of the connected livelihood journey. The platform aims to reduce operational barriers by connecting users with relevant service networks and supply chain support.",
        MARKET_LINKAGE: "Market linkage focuses on connecting producers and enterprises with buyers, markets, and service networks so opportunities can move from production to income.",
        BUYER_CONNECTION: "Buyer connection is designed to help users discover and engage with relevant demand-side actors in a more structured and coordinated way.",
        ENTERPRISE_GROWTH: "Enterprise growth support can include market access, financing connections, services, and coordination that help a business move from early traction to stable operations.",
        SUPPORT_SERVICES: "Support services can include onboarding, advisory, logistics, packaging, compliance, and access to institutions that help users move forward.",
        ECOSYSTEM_ORCHESTRATION: "Ecosystem orchestration is the core idea behind UdaanSetu: coordinating the people, institutions, and services that matter for livelihood growth.",
        MONITORING: "Monitoring and continuity helps keep the journey connected over time, reducing drop-off and helping people progress from support to opportunity to growth.",
        CONTINUITY: "Continuity matters because livelihoods are not one-off transactions. The platform aims to make progress more sustained across training, setup, finance, and market access.",
        PARTNER_COLLABORATION: "UdaanSetu is designed to work with governments, banks, NGOs, CSR organizations, training institutes, insurers, logistics providers, and buyers to build a coordinated ecosystem.",
        DASHBOARD: "A dashboard can help institutions and stakeholders monitor the flow of users, support needs, and ecosystem coordination in a more structured way.",
        DATA: "Data and analytics can help institutions see demand, support flows, and ecosystem coordination patterns across the livelihood journey.",
        DIGITAL_INFRASTRUCTURE: "UdaanSetu is positioned as digital infrastructure for livelihoods: the system that helps connect people, services, and institutions instead of keeping them in isolated silos.",
        ROADMAP: "The pitch deck describes a phased roadmap: start with a pilot district, expand to state-level operations, integrate more ecosystem partners, and eventually scale toward national rollout.",
        PILOT: "Phase 1 focuses on a district-level pilot to validate the model with local partners and initial users before broader scaling.",
        DISTRICT_EXPANSION: "District-level expansion is intended to deepen local partnerships and improve repeatability as the model is tested in more geographies.",
        STATE_EXPANSION: "State expansion aims to replicate the model across priority districts with stronger regional coordination and support structures.",
        ECOSYSTEM_INTEGRATION: "Ecosystem integration brings in buyers, CSR partners, service providers, and institutions to strengthen demand-side pull and long-term continuity.",
        NATIONAL_ROLLOUT: "National rollout is the long-term vision: scale UdaanSetu through aligned institutions and multi-state replication as a livelihood infrastructure platform.",
        IMPACT: "The pitch deck sets out projected impact goals such as 10M+ enterprises created, 500+ institutional partnerships, 2M+ market linkages enabled, and 5M+ jobs supported. These are roadmap targets and projections, not verified current outcomes.",
        BUSINESS_MODEL: "UdaanSetu's business model includes marketplace-related revenue, platform subscriptions, financial services, CSR programme management, data and analytics dashboards, enterprise subscriptions, and institutional partnerships.",
        REVENUE: "The pitch deck lists revenue streams such as marketplace commission, platform subscriptions, financial services, training, and logistics-related revenue. These are projected figures, not current revenue.",
        MARKETPLACE: "Marketplace functionality is intended to improve buyer access, sourcing, selling, and market linkages for relevant sellers and enterprises.",
        SUBSCRIPTION: "Subscription-based business services could support enterprise access, dashboard access, and institutional platform usage as part of the business model.",
        FINANCIAL_SERVICES: "Financial services include banking and lending pathways, embedded financial offerings, and partner integrations aligned with the broader livelihood ecosystem.",
        CSR_PROGRAMS: "CSR programmes can support training, service delivery, and local ecosystem participation that help livelihoods move from access to continuity.",
        DATA_ANALYTICS: "Data and analytics are part of the platform's value proposition, helping institutions understand patterns, gaps, and support needs in the livelihood system.",
        AI: "AI and data infrastructure can help strengthen discovery, matching, and coordination across the ecosystem, but the platform remains a frontend conversational assistant in this website experience.",
        FUNDING: "According to the pitch deck, funding is allocated across technology and AI infrastructure, producer acquisition and expansion, enterprise sales and buyer network, product and operations, marketing, financial services, and compliance.",
        INVESTMENT: "The pitch deck outlines a funding strategy and projected growth path. It is useful to treat these as strategic projections rather than current operational metrics.",
        USE_OF_FUNDS: "According to the pitch deck, the use of funds includes technology and AI infrastructure (30%), producer acquisition and expansion (20%), enterprise sales and buyer network (15%), operations and team (13%), marketing and brand building (10%), financial and embedded services (7%), and compliance and contingency (5%).",
        PROJECTIONS: "The pitch deck includes five-year projections for revenue and impact. These should be seen as strategic targets rather than present-day results.",
        PARTNERSHIP: "Partnerships are central to UdaanSetu's model. The ecosystem is intended to include government, banks, NGOs, CSR organizations, training institutes, buyers, logistics providers, insurers, and other businesses.",
        CONTACT: "You can reach UdaanSetu through email: globalexpressgroup@gmail.com, phone: 96505 60277 / 99101 96123, or address: 13, Institutional Area, Lodhi Road, New Delhi 110003.",
        GENERAL_ENQUIRY: "I can help with UdaanSetu's platform model, livelihood ecosystem, training, financing, markets, partnerships, roadmap, and support journey. What would you like to explore?",
        UNKNOWN: knowledge.fallback || "I don't have verified UdaanSetu information about that yet. I can help with UdaanSetu's livelihood ecosystem, training, finance, market access, partnerships, roadmap, and platform model."
      };

      const direct = responseMap[intent];
      if (intent === "TARGET_USERS" && userType) {
        return `Great. UdaanSetu is designed to help ${capitalize(userType)}s connect with the support they need across training, services, finance, logistics, buyers, and markets.`;
      }
      if (intent === "FINANCE" && userType && !/producer|artisan|entrepreneur|msme|shg|fpo|buyer|institution/.test(userType)) {
        return "UdaanSetu is designed to connect users with financial partners and services. The platform itself is not a direct lender, and loan approval would depend on the relevant financial partner.";
      }
      if (intent === "TRAINING" && userType) {
        return `For ${capitalize(userType)}s, UdaanSetu can connect training, mentoring, and certification with the next steps toward opportunity, growth, and market access.`;
      }
      if (intent === "PRODUCERS" && profileLine) {
        return profileLine;
      }

      return direct || responseMap.UNKNOWN;
    }

    generateSuggestions(intent, userType) {
      const maps = {
        GREETING: ["What is UdaanSetu?", "How does it work?", "Who can use it?"],
        WHAT_IS_UDAANSETU: ["Who is it for?", "How does it work?", "What problem does it solve?"],
        WHY_UDAANSETU: ["What problem does it solve?", "Who can use it?", "How does finance fit in?"],
        PROBLEM: ["How does UdaanSetu help?", "What is the journey?", "Who can partner?"],
        SOLUTION: ["Who is it for?", "How does the journey work?", "What problem does it solve?"],
        TARGET_USERS: ["How does it work?", "How can producers benefit?", "Who can partner with UdaanSetu?"],
        PRODUCERS: ["Training", "Finance", "Find buyers", "Market access"],
        TRAINING: ["What happens after training?", "How does finance fit in?", "How can producers benefit?"],
        FINANCE: ["Financial services", "How does matching work?", "Partner ecosystem"],
        CREDIT: ["Financial services", "How does matching work?", "Partner ecosystem"],
        MARKET_LINKAGE: ["How do buyers connect?", "How can producers benefit?", "How does the journey work?"],
        PARTNER_COLLABORATION: ["Who can partner?", "How does the platform work?", "What is the roadmap?"],
        ROADMAP: ["What is the pilot?", "What is the business model?", "Who can partner?"],
        BUSINESS_MODEL: ["What is the revenue model?", "How is funding allocated?", "What is the roadmap?"],
        CONTACT: ["Who can partner?", "What is UdaanSetu?", "How does it work?"],
        UNKNOWN: ["What is UdaanSetu?", "How does it work?", "Who can partner with UdaanSetu?"],
        DEFAULT: ["What is UdaanSetu?", "How does it work?", "How can I access finance?", "Who can partner with UdaanSetu?"]
      };

      if (userType && (intent === "TRAINING" || intent === "FINANCE" || intent === "MARKET_LINKAGE")) {
        const roleSpecific = {
          producer: ["How can producers benefit?", "Find buyers", "How does finance fit in?"],
          artisan: ["How can artisans benefit?", "How does market access work?", "What about training?"],
          entrepreneur: ["How can entrepreneurs grow?", "What does enterprise growth look like?", "How do I access finance?"],
          shg: ["How can SHGs benefit?", "What support is available?", "How do institutions participate?"],
          fpo: ["How do FPOs benefit?", "What about market linkage?", "How does it support growth?"],
          msme: ["How can MSMEs grow?", "What about finance?", "How do buyers connect?"],
          buyer: ["How do buyers connect?", "How does market linkage work?", "Who can partner?"],
          institution: ["How do institutions participate?", "Who can partner?", "How does coordination work?"],
          ngo: ["How do NGOs participate?", "What about training?", "Who can partner?"],
          bank: ["How do banks participate?", "How does finance fit in?", "Who can partner?"],
          "training institute": ["How can training institutes collaborate?", "How does certification work?", "How does the journey flow?"],
          csr: ["How do CSR programs fit in?", "What about partnerships?", "How does it support livelihoods?"],
          partner: ["How can partners collaborate?", "What is the roadmap?", "Who can use it?"],
          default: ["Who is it for?", "How does it work?", "How does finance fit in?"]
        };
        return roleSpecific[userType] || roleSpecific.default;
      }

      return maps[intent] || maps.DEFAULT;
    }

    generateReply(input, state = this.sessionContext) {
      const normalized = this.normalize(input);
      const userType = getUserTypeFromText(normalized) || state.userType || "";
      let intent = this.detectIntent(input);

      if (intent === "UNKNOWN" && this.sessionContext.lastTopic) {
        const safeTopic = this.sessionContext.lastTopic.toUpperCase();
        if (this.knownIntents.includes(safeTopic)) {
          intent = safeTopic;
        }
      }

      this.sessionContext.userType = userType || this.sessionContext.userType;
      this.sessionContext.lastTopic = intent;
      if (!this.sessionContext.recentTopics.includes(intent) && intent !== "UNKNOWN") {
        this.sessionContext.recentTopics = [intent, ...this.sessionContext.recentTopics].slice(0, 4);
      }
      this.lastIntent = intent;

      const text = this.getResponseText(intent, userType);
      const suggestions = this.generateSuggestions(intent, userType);

      return {
        intent,
        text,
        suggestions: suggestions.slice(0, 4),
        userType
      };
    }

    createWelcomeMessage() {
      return {
        role: "assistant",
        text: "Hi! I'm the UdaanSetu Assistant 👋\n\nI can help you understand how UdaanSetu connects livelihoods with training, finance, services, markets, and growth.\n\nWhat would you like to explore?",
        suggestions: [
          "What is UdaanSetu?",
          "How does it work?",
          "I'm a producer",
          "How can I access finance?",
          "How does market linkage work?",
          "Who can partner with UdaanSetu?"
        ]
      };
    }

    sanitizeMessageText(text) {
      return escapeHtml(String(text || ""));
    }
  }

  window.UdaanSetuChatEngine = new UdaanSetuChatEngine();
})();
