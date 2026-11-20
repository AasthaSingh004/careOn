export const translations = {
  en: {
    // Brand & Identity
    brand_name: "CareOn",
    brand_tagline: "Help is closer than you think.",
    brand_subtitle: "Intelligent Emergency Resource Coordination Platform",
    disclaimer_short: "CareOn is an emergency coordination decision-support prototype. In direct life-threatening situations, always dial 112 or 108.",
    official_helpline_btn: "Official Emergency: Call 112",

    // Navigation
    nav_home: "Home",
    nav_report: "Report Emergency",
    nav_track: "Track Request",
    nav_user_portal: "User Portal",
    nav_user_dashboard: "My Dashboard",
    nav_user_history: "My Incident History",
    nav_user_login: "User Login",
    nav_user_register: "Register Account",
    nav_admin_portal: "Command Centre",
    nav_admin_login: "Admin Login",
    nav_privacy: "Privacy & Terms",
    nav_logout: "Logout",
    nav_notifications: "Notifications",
    system_online: "System Online (LIVE)",
    system_connecting: "System Connecting...",
    citizen_portal: "Citizen Portal",
    login_link: "Sign In",
    notifications_title: "Notifications",
    hero_title: "Every second matters. We're here to help.",
    hero_subtitle: "Report an emergency, find coordinated assistance and stay updated throughout the response.",
    hero_report_btn: "Report an Emergency",
    hero_track_btn: "Track My Request",
    hero_sahara_btn: "Talk to Sahara",

    // Hero Section
    hero_headline: "Every second matters. We're here to help.",
    hero_subheadline: "Report an emergency, find coordinated specialist assistance, and stay updated throughout the response.",
    btn_report_emergency: "🚨 Report an Emergency",
    btn_track_my_request: "🔍 Track My Request",
    btn_talk_to_sahara: "💬 Talk to Sahara",
    hero_stat_conflict: "100% Conflict Prevention",
    hero_stat_fee: "₹0 Platform Fee",
    hero_stat_coverage: "Mysuru & Regional Coverage",

    // How CareOn Works
    how_it_works_heading: "How CareOn Works",
    how_it_works_subheading: "A coordinated, multi-stakeholder bridge between citizens, emergency responders, and partner networks.",
    step1_title: "1. Report an Emergency",
    step1_desc: "Share incident category, what happened, and your location in 30 seconds with instant GPS detection.",
    step2_title: "2. CareOn Evaluates the Request",
    step2_desc: "Rule-based triage engine assesses severity, classifies priority, and checks for proximity duplicates.",
    step3_title: "3. Resources are Coordinated",
    step3_desc: "CareOn matches available specialist teams without resource conflict, or queries external partners.",
    step4_title: "4. Track Updates & Assistance",
    step4_desc: "Track live responder progress, estimated arrival times, and transparent cost consent.",

    // Feature Cards
    features_heading: "Comprehensive Emergency Coordination",
    feat_coordination_title: "Smart Emergency Coordination",
    feat_coordination_desc: "Evaluates incident urgency and matches specialized capabilities (ALS ambulances, trauma units, fire tenders, rescue boats).",
    feat_shortage_title: "Resource Shortage Management",
    feat_shortage_desc: "When city fleet units are occupied, the platform identifies missing resource types and coordinates vetted partner networks.",
    feat_external_title: "External Assistance Coordination",
    feat_external_desc: "Engages registered partner hospitals, private ambulances, and disaster NGOs using a partner-first fallback strategy.",
    feat_tracking_title: "Real-Time Incident Tracking",
    feat_tracking_desc: "Follow the response lifecycle step-by-step from receipt to verification, dispatch, arrival, and resolution.",
    feat_sahara_title: "Sahara Caring Companion",
    feat_sahara_desc: "Friendly AI support companion guiding citizens through reporting, tracking, and reassurance with strict safety boundaries.",
    feat_transparency_title: "Transparent Service Costs",
    feat_transparency_desc: "CareOn charges ₹0 platform fee. External private provider quotations require explicit user consent before dispatch.",

    // Auth & Navigation
    user_login_title: "Citizen Portal Login",
    user_login_subtitle: "Access your reported emergencies, live tracking, and emergency alerts.",
    user_register_title: "Create Citizen Account",
    user_register_subtitle: "Register to maintain private emergency records and receive coordinated updates.",
    admin_login_title: "Command Centre Login",
    admin_login_subtitle: "Authorized access for emergency coordinators and administrators.",
    admin_login_btn: "Access Command Centre",
    email_label: "Email Address",
    email_placeholder: "Enter your email",
    password_label: "Password",
    password_placeholder: "Create a secure password",
    confirm_password_label: "Confirm Password",
    confirm_password_placeholder: "Confirm your password",
    full_name_label: "Full Name",
    full_name_placeholder: "Enter your full name",
    phone_label: "Phone Number",
    phone_placeholder: "Enter your phone number",
    sign_in_btn: "Sign In",
    create_account_btn: "Create Account",
    demo_account_hint: "Fast Evaluation Demo Credentials",
    fill_demo_user: "Fill Citizen Demo",
    fill_demo_admin: "Fill Coordinator Demo",
    no_account_prompt: "Don't have an account?",
    register_link: "Register here",
    already_have_account: "Already have an account?",
    coordinator_access_hint: "Are you an emergency coordinator?",
    admin_login_link: "Coordinator Login",
    looking_for_user_portal: "Looking for Citizen Portal?",
    fill_all_fields: "Please fill in all required fields.",
    invalid_credentials: "Invalid email or password.",
    admin_unauthorized: "Access denied. Administrator privileges required.",
    login_success: "Login successful! Redirecting...",
    register_success: "Account created successfully! Redirecting...",
    password_mismatch: "Passwords do not match.",
    loading: "Loading...",
    logout_btn: "Logout Session",

    // User Dashboard
    authenticated_citizen_badge: "Verified Citizen Account",
    welcome_back: "Welcome,",
    refresh_feed: "Refresh Feed",
    refresh: "Refresh",
    feed_refreshed: "Feed refreshed successfully with live incident data.",
    my_requests_title: "My Emergency Incidents",
    btn_report_new: "Report New Emergency",
    no_incidents_title: "No Active Emergency Incidents",
    no_incidents_desc: "You have not submitted any emergency requests yet. If you require medical, fire or rescue assistance, report an incident anytime.",
    track_incident_btn: "Track Live",
    recent_notifications: "My Notifications",
    no_notifications: "No new notifications.",
    helpline_alert_title: "National Emergency Helpline",
    helpline_alert_desc: "For immediate life-threatening situations, also dial 112 directly.",
    dial_112_btn: "Call 112",
    feedback: "Feedback",

    // Home & Features
    how_it_works_title: "How CareOn Works",
    feature1_title: "Quick Emergency Dispatch",
    feature1_desc: "Coordinates ALS ambulances, trauma teams, fire engines, and rescue vehicles from nearest bases.",
    feature2_title: "Backup Help & Partner Network",
    feature2_desc: "Automatically queries registered private hospitals and volunteer NGOs when municipal resources are occupied.",
    feature3_title: "No Double-Booking",
    feature3_desc: "Ensures no vehicle is double-assigned across concurrent emergencies with real-time lock verification.",
    feature4_title: "Smart Resource Planning",
    feature4_desc: "Forecasts resource demand based on demographic density, weather conditions, and historical trends.",
    feature5_title: "Safe & Private Emergency Help",
    feature5_desc: "Citizen health records remain strictly confidential with OTP verification to deter spam.",
    feature6_title: "Sahara 24/7 AI Companion",
    feature6_desc: "Caring, multi-lingual emergency support assistant available around the clock.",
    zero_commission_title: "₹0 Platform Fee — Transparent Emergency Coordination",
    zero_commission_desc: "CareOn charges ₹0 platform fee. If private providers charge a fee, coordinators present quotations for explicit citizen consent.",

    // User Portal & Auth
    login_title_user: "User Portal Login",
    login_subtitle_user: "Access your reported emergencies, tracking status, and personal notifications.",
    login_title_admin: "Command Centre Coordinator Login",
    login_subtitle_admin: "Authorized access for emergency dispatch coordinators and platform administrators.",
    register_title: "Create Citizen Account",
    register_subtitle: "Register to maintain private emergency records and receive coordinated updates.",
    form_fullname: "Full Name",
    form_email: "Email Address",
    form_phone: "Phone Number",
    form_password: "Password",
    form_confirm_password: "Confirm Password",
    form_remember_me: "Remember this session",
    btn_sign_in: "Sign In",
    btn_register: "Create Account",
    already_have_account: "Already have an account? Sign In",
    need_account: "Need a citizen account? Register here",
    admin_access_only: "Command Centre access is restricted to verified coordinators.",

    // User Dashboard
    user_dashboard_title: "Citizen Emergency Dashboard",
    user_welcome: "Welcome back",
    user_active_requests: "Active Emergency Requests",
    user_no_active: "You have no active emergency requests right now.",
    user_quick_actions: "Quick Emergency Actions",
    user_history_title: "My Incident History",
    user_profile_card: "Reporter Profile",
    user_trust_status: "Verification Status",

    // Emergency Reporting Form
    report_title: "Report an Emergency",
    report_subtitle: "Please provide accurate details so coordinators can dispatch the right response unit.",
    cat_select_label: "1. Select Emergency Category *",
    desc_label: "2. What happened? (Short Description) *",
    desc_placeholder: "Describe the situation (e.g., Two-wheeler collision near junction, rider injured and unconscious)...",
    loc_label: "3. Location / Landmark in Mysuru *",
    loc_placeholder: "E.g., Near KR Hospital Gate 2, Sayyaji Rao Road, Mysuru",
    btn_use_gps: "📍 Use My GPS Location",
    loc_detecting: "Detecting GPS coordinates...",
    affected_label: "Number of Affected People *",
    help_label: "Type of Help Required",
    help_placeholder: "E.g., ALS Ambulance with oxygen, First Aid, Fire tender",
    contact_name_label: "Contact Person Name *",
    contact_phone_label: "Contact Phone Number *",
    disaster_details_label: "Disaster Relief Supplies Needed",
    disaster_details_placeholder: "E.g., Drinking water (500L), rescue boats, food packets",
    demo_otp_notice: "Emergency Verification: Enter the in-app verification code generated for your contact number.",
    emergency_notice: "Before you request help: Please share correct information so we can coordinate the right assistance. Your details may be used to verify and respond to your request. External services may have separate charges; we'll inform you before arranging paid assistance whenever consent can be obtained. Deliberately false reports may lead to review and appropriate action. Your safety comes first. ❤️",
    btn_submit_report: "🚨 Submit Emergency Report",
    submitting_report: "Submitting & Classifying Emergency...",

    // Categories
    cat_medical: "Medical",
    cat_medical_desc: "Cardiac arrest, respiratory distress, acute trauma, unconsciousness",
    cat_road_accident: "Road Accident",
    cat_road_accident_desc: "Two-wheeler collision, vehicle crash, highway accident",
    cat_fire: "Fire Outbreak",
    cat_fire_desc: "Commercial or residential structure fire, smoke hazard, gas leak",
    cat_rescue: "Rescue Operation",
    cat_rescue_desc: "Building collapse, trapped in water, search and rescue",
    cat_disaster: "Disaster / Mass Casualty",
    cat_disaster_desc: "Urban flood waterlogging, cloudburst, mass casualty disaster",
    cat_safety: "Safety / Other",
    cat_safety_desc: "Public safety distress, crowd hazard, first-aid support",

    // Incident Tracking
    track_title: "Track Emergency Request",
    track_search_placeholder: "Enter Incident Code (e.g. CARE-2026-101)",
    btn_search_track: "Track Request",
    track_status_label: "Current Status",
    track_reported_at: "Reported At",
    track_priority_label: "Priority",
    track_assigned_unit: "Assigned Emergency Response Unit",
    track_eta_label: "Estimated Arrival",
    track_cost_breakdown_title: "Cost Transparency & External Provider Details",
    platform_fee_label: "CareOn Platform Fee",
    platform_fee_val: "₹0.00 (Always Free)",
    provider_quote_label: "External Partner Quotation",
    subsidy_label: "Subsidy / NGO Sponsorship",
    net_payable_label: "Net Payable to Provider",
    consent_pending_alert: "Please review the external provider quotation and confirm consent to dispatch.",
    btn_accept_quote: "✓ Accept Quotation & Dispatch",
    btn_decline_quote: "✕ Decline (Seek Free Public/NGO Alternative)",
    consent_approved_badge: "✓ Consent Approved by Reporter",
    btn_contact_coordinator: "📞 Contact Command Coordinator (+91 821 244 5566)",
    btn_cancel_request: "✕ Cancel Request",
    cancel_modal_title: "Cancel Emergency Request",
    cancel_modal_desc: "Please let our command coordinator know why you are cancelling so we can safely release any dispatched resources.",
    cancel_reason_label: "Reason for Cancellation *",
    cancel_reason_resolved: "Emergency resolved",
    cancel_reason_independent: "Help arranged independently",
    cancel_reason_mistake: "Request submitted by mistake",
    cancel_reason_other: "Other",
    cancel_details_label: "Additional Details (Optional)",
    btn_confirm_cancel: "Confirm Cancellation",
    btn_keep_active: "Keep Request Active",
    cancelling_text: "Cancelling...",

    // Statuses
    status_received: "Received",
    status_verification_pending: "Verification Pending",
    status_verified: "Verified",
    status_assistance_search: "Assistance Search",
    status_provider_contacted: "Provider Contacted",
    status_awaiting_provider: "Awaiting Provider Response",
    status_awaiting_consent: "Awaiting User Consent",
    status_assignment_confirmed: "Assignment Confirmed",
    status_team_dispatched: "Team Dispatched",
    status_team_arrived: "Team Arrived",
    status_resolved: "Resolved",
    status_cancelled: "Cancelled",
    status_rejected: "Rejected",

    // Feedback
    feedback_title: "Emergency Resolved — Share Your Feedback",
    feedback_subtitle: "Thank you for sharing your experience. ❤️ Your feedback helps us make CareOn better for everyone.",
    feedback_rating_label: "How would you rate the emergency coordination? (1 - 5 Stars)",
    feedback_tags_label: "Feedback Tags",
    tag_easy_to_use: "Easy to use",
    tag_clear_updates: "Clear updates",
    tag_helpful_coordination: "Helpful coordination",
    tag_slow_response: "Slow response",
    tag_other: "Other",
    feedback_comments_label: "Written Comments (Optional)",
    btn_submit_feedback: "Submit Feedback",
    feedback_received: "Feedback Received — Thank you!",

    // Admin Command Centre
    admin_title: "Emergency Operations Command Centre",
    admin_subtitle: "Real-time incident triage, capability matching, shortage alerts, and partner coordination across Mysuru.",
    btn_refresh_feed: "🔄 Refresh Feed",
    refreshing_feed: "Refreshing live data...",
    feed_refreshed_toast: "Live feed synchronized with backend.",
    admin_stat_active: "Active Incidents",
    admin_stat_critical: "Critical Priority",
    admin_stat_fleet_avail: "Fleet Available",
    admin_stat_shortages: "Active Shortages",
    admin_stat_registered_partners: "Registered Partners",
    admin_stat_resolved: "Resolved Calls",

    // Admin Sidebar Tabs
    tab_overview: "📊 Overview",
    tab_incidents: "🚨 Incidents Queue",
    tab_resources: "🚑 Fleet Resources",
    tab_allocations: "🧠 Smart Allocation",
    tab_shortages: "⚠️ Shortage Alerts",
    tab_providers: "🏥 External Partners",
    tab_map: "🗺️ Live Mysuru Map",
    tab_simulation: "🎯 Shortage Challenge",
    tab_verification: "🔍 Trust & Verification",
    tab_disaster: "🌊 Disaster Relief",
    tab_analytics: "📈 Analytics & ML",

    // Admin Table Headers
    th_code: "Incident Code",
    th_category: "Category",
    th_location: "Location (Mysuru)",
    th_reporter: "Reporter Details",
    th_priority: "Priority",
    th_status: "Status",
    th_verification: "Verification",
    th_actions: "Actions",
    btn_inspect: "Inspect",
    btn_verify_otp: "Verify OTP",
    btn_resolve: "Resolve",
    btn_release_fleet: "Release Fleet",
    btn_allocate: "Allocate Unit",

    // Sahara
    sahara_name: "Sahara",
    sahara_role: "Your caring emergency support companion",
    sahara_greeting: "Hey there! ❤️ I'm Sahara, your caring emergency support companion. Take a breath. We'll figure out the next step together. What happened?",
    sahara_disclaimer: "Sahara cannot provide medical diagnoses. For life-threatening emergencies, always dial 112 immediately.",
    sahara_placeholder: "Ask Sahara or enter incident code...",

    // Notifications
    notif_title: "Notification Centre",
    notif_empty: "No new notifications. Real-time updates will appear here.",
    notif_mark_read: "Mark Read",

// Additional Global / Header / Navigation
    nav_admin: "Command Centre",
    command_centre_title: "Command Centre",
    command_centre_subtitle: "Real-time incident triage, capability matching, shortage alerts, and partner coordination across Mysuru.",
    admin_role: "Coordinator",
    refreshing: "Refreshing...",
    reset_demo_state: "Reset Simulation",
    built_with_care: "Built with care for emergency decision-support.",
    quick_links: "Portals & Services",
    command_support_title: "Coordinator Support",
    disclaimer_title: "Emergency Notice",
    footer_disclaimer: "CareOn is an intelligent resource coordination decision-support prototype. It is not a replacement for official government emergency services. For immediate life-threatening situations, always dial 112 directly.",
    
    // Admin Metric Cards
    stat_active_incidents: "Active Incidents",
    stat_critical_priority: "Critical Priority",
    stat_fleet_available: "Fleet Available",
    stat_active_shortages: "Active Shortages",

    // Home / Hero / Workflow / Features
    hero_badge: "Intelligent Resource Coordination",
    workflow_subtitle: "Seamless Coordination Journey",
    how_it_works_desc: "A synchronized bridge between citizens in need, dispatch coordinators, and emergency response teams.",
    platform_capabilities_badge: "Engineered For Resilience",
    features_section_title: "Comprehensive Resource Coordination",
    features_section_desc: "Designed to prevent resource bottlenecks, eliminate allocation conflicts, and deliver rapid response.",
    
    // Report Emergency Page
    report_emergency_title: "Report an Emergency",
    report_emergency_desc: "Provide key incident details. CareOn coordinates the closest suitable medical, fire, or rescue fleet.",
    emergency_category_label: "Select Emergency Category",
    what_happened_label: "What happened? (Short Description)",
    location_label: "Location / Landmark in Mysuru",
    location_placeholder: "E.g., Near KR Hospital, Sayyaji Rao Road, Mysuru",
    use_my_location: "Use My GPS Location",
    locating: "Detecting GPS...",
    affected_people_label: "Affected People",
    help_required_label: "Type of Help Required",
    disaster_supplies_label: "Mass Disaster Relief Supplies",
    disaster_placeholder: "E.g., Drinking water, rescue boats, emergency shelter",
    contact_name_label: "Your / Contact Name",
    contact_phone_label: "Contact Phone Number",
    submit_emergency_btn: "Submit Emergency Request",
    submitting: "Submitting Incident...",
    demo_otp_title: "Emergency Contact Verification",
    demo_otp_desc: "An emergency verification code is generated for your contact number upon submission.",
    pre_authorized: "Simulated Verification",
    report_failed: "Failed to submit emergency report.",
    err_desc_required: "Please provide a brief description of what happened (at least 5 characters).",
    err_loc_required: "Please specify the location or landmark.",
    err_contact_required: "Contact person name and phone number are required.",
    invalid_phone: "Please enter a valid phone number (at least 8 digits).",
    geo_not_supported: "Geolocation is not supported by your browser.",

    // Incident Category Descriptions
    cat_desc_medical: "Cardiac, breathing, trauma, severe injury",
    cat_desc_road: "Vehicular collision, trapped passengers",
    cat_desc_fire: "Building fire, smoke, gas cylinder leak",
    cat_desc_rescue: "Building collapse, lake drowning, trapped victim",
    cat_desc_disaster: "Heavy flood, storm, mass casualty event",
    cat_desc_safety: "Public safety distress, crowd hazard, first-aid",

    // Track Request Page
    track_request_title: "Track Emergency Request",
    track_input_placeholder: "Enter Incident Code (e.g. CARE-2026-101)",
    track_request_btn: "Track Request",
    incident_not_found: "Could not find incident",
    incident_privacy_restricted: "This incident record is private and belongs to another user.",
    assigned_unit_title: "Assigned Emergency Response Unit",
    eta: "Estimated Arrival",
    timeline_title: "Live Activity & Audit Timeline",
    awaiting_updates: "Awaiting initial coordinator updates...",
    cost_transparency_title: "Cost Transparency & External Provider Details",
    platform_fee_free: "₹0.00 (Always Free)",
    free_public_resources: "No external paid provider assigned. Standard public/platform resources deployed at zero charge.",
    consent_required_msg: "Informed consent required for external provider service.",
    consent_accepted: "Accepted by Citizen",
    accept_quote: "Accept Quotation & Confirm Dispatch",
    decline_quote: "Decline (Seek Free Alternative)",
    confirm_cancellation: "Confirm Cancellation",
    cancel_details_placeholder: "E.g., Local clinic doctor arrived, patient is stable...",
    reason_arranged_independently: "Help arranged independently",
    reason_mistake: "Request submitted by mistake",
    reason_resolved: "Emergency resolved",
    reason_other: "Other",
    keep_active: "Keep Active",
    contact_coordinator: "Contact Command Coordinator",
    additional_details: "Additional Details (Optional)",
    reported_at: "Reported",
    category: "Type",
    emergency_resolved_title: "Emergency Resolved — Share Your Feedback",
    rate_coordination: "How would you rate the emergency coordination? (1 - 5 Stars)",
    rating_label: "Rating (1 - 5 stars)",
    written_comments: "Written Comments (Optional)",
    feedback_comments_placeholder: "Share any thoughts on response speed, clarity, or coordinator support...",
    feedback_intro: "Thank you for sharing your experience. Your feedback helps make CareOn better for everyone.",
    feedback_thanks: "Thank you! Your ratings have been logged in the coordinator quality database.",
    submit_feedback_title: "Rate Response Coordination",

    // User Dashboard Actions
    my_dashboard: "My Dashboard",
    user_action_report_desc: "Submit an urgent medical, fire, or accident emergency with GPS.",
    user_action_track_desc: "View real-time dispatch progress, responder ETA, and notes.",
    user_action_sahara_desc: "Ask Sahara for emergency guidance, triage steps, or helpline assistance.",
    resource_dispatched: "Response Team Assigned",

    // Sahara Chatbot
    sahara_tagline: "Your caring emergency companion",
    sahara_intro: "Hey there! ❤️ I'm Sahara, your caring emergency support companion. Take a deep breath — help is closer than you think. Tell me what is happening or enter an incident code.",
    sahara_typing: "Sahara is typing...",
    ask_sahara_placeholder: "Ask Sahara or enter incident code...",
    safe_companion: "Safe Companion",
    sahara_offline_reply: "I'm right here with you. ❤️ I had a brief network glitch, but if you need immediate emergency dispatch, please click Report Emergency or call 112 directly.",

    // Auth & General
    admin_login_success: "Authentication successful! Redirecting to Command Centre...",
    demo_admin_credentials_hint: "Demonstration Coordinator Account",
    registration_failed: "Registration failed.",
    invalid_email: "Please enter a valid email address.",
    password_too_short: "Password must be at least 6 characters long.",
    name_required: "Full name is required.",
    submit: "Submit",
    cancel: "Cancel",
    comments_label: "Comments or Coordinator Notes",
    faq_categories_question: "What emergency categories are supported?",
    faq_charge_question: "Does CareOn charge any coordination fees?",
    // Privacy Policy
    privacy_title: "Privacy, Terms & Responsible Prototype Disclosure",
    privacy_updated: "Last updated: Prototype Demonstration Version 2026",
    privacy_sec1_title: "1. Educational Decision-Support Prototype Notice",
    privacy_sec1_desc: "CareOn is an intelligent emergency resource coordination prototype developed for academic demonstration and faculty review. CareOn is NOT an official emergency service, municipal 911/112 operator, police service, or replacement for government emergency dispatchers.",
    privacy_sec2_title: "2. Cost Transparency & ₹0 Platform Fee",
    privacy_sec2_desc: "CareOn does not charge citizens any commission or platform fee for requesting emergency help. If platform resources are unavailable and an external private provider is engaged, the coordinator transparently displays the quotation and requests informed user consent before dispatching paid assistance.",
    privacy_sec3_title: "3. Data Retention & Responsible Handling",
    privacy_sec3_item1: "Contact details and coordinates are only collected to coordinate relevant specialist assistance.",
    privacy_sec3_item2: "Passwords are encrypted with PBKDF2-HMAC-SHA256 salts.",
    privacy_sec3_item3: "All phone numbers in seeded demonstrations are safe fictional demo numbers.",
    privacy_sec3_item4: "Normal users cannot inspect another user's private incident details.",
    privacy_sec3_item5: "Administrators have role-protected command centre access with audit logging.",
    privacy_sec4_title: "4. Sahara Emergency Companion Boundaries",
    privacy_sec4_desc: "Sahara is a rule-based AI companion designed to provide supportive guidance and help track emergency requests. Sahara does NOT diagnose medical conditions, prescribe medication, or invent dispatch arrival times. For immediate life threats, citizens are directed to official emergency hotlines (112 / 108).",

    // Notification Drawer
    notification_centre_title: "Notification Centre",
    no_notifications_desc: "No notifications yet. Updates will appear here in real time.",
    mark_read: "Mark Read",
    dismiss: "Dismiss",
    view_in_drawer: "View in Bell",
    refresh_failed: "Failed to refresh live data from server.",
    updated_just_now: "Updated just now",
    acknowledge_alert: "Acknowledge & Silence",
    new_emergency_alert: "🚨 New Emergency Alert: Immediate Action Required",
    alert_acknowledged: "Alert acknowledged and silenced.",
    sound_enabled: "Sound: On",
    sound_disabled: "Sound: Off",
    view_incident_triage: "View & Triage",

    // Admin Dashboard Sections & Cards
    active_incident_queue_title: "Active Incident Priority Queue",
    btn_view_all: "View All",
    fleet_availability_title: "Fleet Availability & Immediate Shortages",
    fleet_categories_label: "Fleet Categories:",
    critical_shortage_detected: "⚠️ Critical Shortage Detected:",
    incident_mgmt_title: "Incident Management & Verification Queue",
    duplicate_flag_badge: "Duplicate Flag",
    fleet_mgmt_title: "Emergency Fleet Management",
    fleet_mgmt_desc: "Monitor vehicle availability, maintenance states, and current active assignments. Double-assignment is prevented at the database transaction layer.",
    smart_allocation_engine_title: "Smart Resource Allocation Engine",
    smart_allocation_engine_desc: "Evaluates incident urgency, capability match, and geographic travel time while strictly enforcing conflict prevention.",
    active_shortages_mgmt_title: "Active Resource Shortage Management",
    active_shortages_mgmt_desc: "When city fleet resources are depleted, CareOn recommends engaging external partner hospitals or private ambulances.",
    no_active_shortages_msg: "✓ No active fleet shortages at this time. All active calls have available response units.",
    external_providers_dir_title: "Registered Partners & External Providers Directory",
    external_providers_dir_desc: "CareOn operates with a partner-first fallback strategy. An external provider quotation requires informed user consent before dispatch confirmation.",
    registered_partner_badge: "Registered Partner",
    fallback_dir_badge: "Fallback Directory",
    live_map_dispatch_title: "Live Geographical Dispatch & Tracking",
    live_map_dispatch_desc: "OpenStreetMap Leaflet visualization showing active emergency pins, available units, and partner facilities.",
    simulation_expo_title: "🎯 Resource Shortage Challenge — Interactive Walkthrough",
    simulation_expo_desc: "This interactive walkthrough demonstrates CareOn's core coordination capabilities: multi-incident prioritization, conflict prevention, shortage detection, and external provider coordination.",
    trust_review_title: "Reporter Verification & Trust Review",
    trust_review_desc: "CareOn assesses trust signals (phone format, OTP verification, proximity duplicates, reporting history) to prevent deliberate misuse without deterring genuine citizens.",
    disaster_mgmt_title: "🌊 Disaster Management & Mass Casualty Extension",
    disaster_mgmt_desc: "Tracking supplies (food, drinking water, family tents) and coordination for large-scale urban flooding or structural collapse.",
    available_relief_assets_title: "Available Relief Assets",
    ml_predictor_title: "📊 Rule-Based Resource Shortage Risk Predictor",
    ml_predictor_desc: "Calculates estimated demand surges by zone, time-of-day multipliers, and active fleet buffer.",
    ml_predictor_notice: "Notice: Rule-based demand estimation model for coordinator decision support. Not an official municipal emergency forecast.",

    // Badges & Verifications
    flagged_duplicate_badge: "Flagged Proximity Duplicate",
    unique_incident_badge: "✓ Unique Incident",
    genuine_incident_badge: "Genuine Incident",
    awaiting_otp_label: "Awaiting OTP",
    verified_label: "✓ Verified",

    // KPIs
    kpi_avg_rating: "AVG COORDINATOR RATING",
    kpi_from_reviews: "From 14 verified reporter reviews",
    kpi_avg_eta: "ESTIMATED AVERAGE ETA",
    kpi_eta_context: "Urban corridor with 1.25x traffic factor",
    kpi_conflict_rate: "CONFLICT PREVENTION RATE",
    kpi_zero_double: "0 double-assignments recorded",

    // Admin Details Modal
    lbl_category: "Category",
    lbl_description: "Description",
    lbl_location: "Location",
    lbl_casualties: "Casualties / Affected",
    lbl_help_requested: "Help Requested",
    lbl_contact: "Contact",
    lbl_initial_priority_reason: "Initial Priority Reason",
    lbl_coordinator_priority_adj: "Coordinator Priority Adjustment",
    lbl_available_fleet_units: "Available Fleet Units (Direct Assignment):",

    // Table Headers
    th_verified: "Verified",
    th_incident_code: "Incident Code",
    th_contact_person: "Contact Person",
    th_phone_number: "Phone Number",
    th_otp_status: "OTP Status",
    th_duplicate_check: "Duplicate Check",
    th_trust_decision: "Trust Decision",
    th_zone: "Geographic Zone",
    th_predicted_risk: "Predicted Shortage Risk",
    th_risk_score: "Risk Score",
    th_resource_in_demand: "Resource in Demand",
    th_time_context: "Time Context",
    th_recommended_action: "Recommended Coordinator Action",

    // Buttons
    btn_details: "Details",
    btn_mark_available: "Mark Available",
    btn_set_maintenance: "Set Maintenance",
    btn_simulate_partner_contact: "Simulate Partner Contact",
    btn_simulate_contact_quote: "Simulate Contact & Quotation",
    btn_pause_movement: "⏸ Pause Movement Simulation",
    btn_simulate_movement: "▶ Simulate Live Dispatch Movement",
    btn_reset_scenario: "↺ Reset Scenario to Step 1",
    btn_assign_prefix: "+ Assign",
    btn_dispatch_relief_van: "Dispatch Disaster Relief Supply Van 01",
    btn_save_priority_change: "Save Priority Change",

    // Simulation Steps
    sim_step1_title: "Step 1: Multiple Simultaneous Emergencies Loaded",
    sim_step1_desc: "Three simultaneous emergencies are active across Mysuru (Sayyaji Rao Road cardiac arrest, Kuvempunagar road accident, and Gokulam kitchen fire).",
    sim_step2_title: "Step 2: Fleet Constrained (Only 1 Ambulance Available)",
    sim_step2_desc: "Ambulance 01 is assigned to CARE-2026-101. Ambulance 03 is in maintenance. Only CityCare Ambulance 02 remains in the active fleet.",
    sim_step3_title: "Step 3: Run Allocation & Demonstrate Conflict Prevention",
    sim_step3_desc: "The smart allocator awards the remaining ambulance to the highest priority call. The system strictly blocks assigning the occupied ambulance to another active incident.",
    sim_step4_title: "Step 4: Shortage Alert & Partner Enquiry",
    sim_step4_desc: "CARE-2026-103 experiences a critical fleet shortage. Contact the registered partner (CityCare Private Fleet) and record the quotation (₹1,500).",

    // Quotation & Tracking Labels
    lbl_ext_quotation: "External Partner Quotation",
    lbl_subsidy_amount: "Subsidy / NGO Sponsorship",
    lbl_net_payable: "Net Payable to Service Provider",
    contact_label: "Contact",
    mins_label: "mins",

    // Badges & Common
    urgent_badge: "URGENT",
    live_badge: "LIVE",
    ai_badge: "24/7 AI",
    sahara_safe_companion_desc: "Sahara provides coordination support. For life-threatening emergencies, dial 112 immediately.",
    backend_service_status: "Backend Service Status",
    role_admin: "Admin",
    role_user: "User",
    language_selector: "Language Selector",
    national_helpline_label: "National Helpline",
    coordination_email_label: "Coordination",
    mysuru_command_region: "Mysuru Command Region, Karnataka, India",

    // Map Picker & Legend
    map_picker_hint: "📍 Click map or drag pin to select exact Mysuru coordinates",
    lat_label: "Lat",
    lon_label: "Lon",
    map_legend_incidents: "Emergency Incidents",
    map_legend_available: "Available Fleet",
    map_legend_dispatched: "Dispatched Units",
    map_legend_partners: "Partner Hospitals & NGOs",
    map_simulation_active: "Vehicle Movement Active",
    map_center_label: "Mysuru City Region (12.3052° N, 76.6552° E)",

    // Notification Titles & System Terms
    "Emergency Request Received": "Emergency Request Received",
    "Ambulance Dispatched": "Ambulance Dispatched",
    "Assistance Search Started": "Assistance Search Started",
    "Provider Contacted": "Provider Contacted",
    "Provider Quoted": "Provider Quoted",
    "Consent Accepted": "Consent Accepted",
    "Incident Resolved": "Incident Resolved",
    "Request Cancelled": "Request Cancelled",
    "Cancellation Acknowledged": "Cancellation Acknowledged",
    "Emergency OTP Verified": "Emergency OTP Verified",
    "Medical Tele-triage Callback Requested": "Medical Tele-triage Callback Requested",
    "Doctor Callback Status Updated": "Doctor Callback Status Updated",
    "New Incident Reported": "New Incident Reported",
    "Incident Needs Review": "Incident Needs Review",
    "Shortage Alert": "Shortage Alert",
    "Duplicate Flagged": "Duplicate Flagged",
    "Urgent Action Required": "Urgent Action Required",
    "Under Maintenance": "Under Maintenance",
    "Available": "Available",
    "Assigned": "Assigned",
    "Dispatched": "Dispatched",
    "System": "System",
    "Coordinator": "Coordinator",
    "Reporter": "Reporter",


    // Stage 5 & 6: Sahara Voice & Personalized Greetings
    voice_input_tooltip: "Voice input (Speak to Sahara)",
    voice_listening: "Listening... Speak now",
    voice_unsupported: "Voice input is not supported in this browser",
    voice_permission_error: "Microphone access denied or unavailable",
    personalized_greeting_prefix: "Hey",

    // Stage 5 & 6: Simulated In-App OTP Verification
    otp_verification_title: "Emergency Contact Verification (Simulated In-App OTP)",
    otp_verification_desc: "A secure verification code was generated for your contact number. Enter the 6-digit code below to confirm this report.",
    simulated_otp_display: "Simulated Code:",
    enter_otp_placeholder: "Enter 6-digit code",
    btn_verify_otp: "Verify Code",
    btn_request_new_otp: "Request New Code",
    otp_verified_badge: "✓ Phone Contact Verified",
    otp_verifying: "Verifying...",
    otp_success_msg: "Emergency contact phone verified successfully.",

    // Stage 5 & 6: Doctor Tele-Triage Callback
    doctor_callback_title: "Doctor Tele-Triage Callback",
    doctor_callback_desc: "Request an urgent tele-triage consultation with an on-call medical advisor while responders coordinate.",
    btn_request_callback: "Request Doctor Callback",
    chief_complaint_label: "Chief Complaint / Urgent Symptoms",
    chief_complaint_placeholder: "Describe patient condition (e.g. chest tightness, high fever with breathlessness)...",
    callback_disclaimer: "Doctor callbacks provide tele-triage guidance for urgent concerns. For acute, life-threatening danger, dial 112 immediately.",
    callback_status_pending: "Callback Requested (Awaiting Coordinator Review)",
    callback_status_in_progress: "Callback In Progress (Doctor Contacting)",
    callback_status_contacted: "Citizen Contacted by Medical Advisor",
    callback_status_completed: "Tele-Triage Consultation Completed",
    tab_doctor_callbacks: "🩺 Doctor Callbacks",
    th_chief_complaint: "Chief Complaint",
    th_callback_status: "Callback Status",
    btn_mark_in_progress: "Mark In Progress",
    btn_mark_contacted: "Mark Contacted",
    btn_mark_completed: "Mark Completed",

    // Stage 5 & 6: Official Direct Emergency Line
    direct_emergency_line: "Official Emergency Services",

    // Arrival Tracker
    arrival_tracker_title: "Help is on the way!",
    arrival_tracker_subtitle: "Your emergency response vehicle has been dispatched and is moving toward your location.",
    arrival_tracker_eta: "Estimated Arrival",
    arrival_tracker_mins: "mins",
    arrival_tracker_unit: "Assigned Unit",
    arrival_tracker_demo_badge: "DEMO SIMULATION",
    arrival_tracker_live_badge: "LIVE GPS",
    arrival_confirm_btn: "Confirm Help Arrived",
    arrival_confirm_dialog: "Did the emergency response unit arrive at your location?",
    arrival_stage_received: "Request Received",
    arrival_stage_dispatched: "Unit Dispatched",
    arrival_stage_enroute: "On Route",
    arrival_stage_arrived: "Arrived at Scene",
    arrival_tracker_map_preview: "Live Route Preview",
    enlarge_map_btn: "Enlarge Map",
    close_map_btn: "Close Map",
    enlarged_map_title: "Emergency Response Route & Tracker",
    stay_safe_title: "Stay Safe While You Wait",
    safety_tips_paused: "Paused on interaction",
    safety_tip_med_1: "Keep the person comfortable and avoid unnecessary movement if seriously injured.",
    safety_tip_med_2: "Ensure clear airflow around the person and loosen tight clothing.",
    safety_tip_med_3: "Stay calm, keep your phone line free, and prepare any known medical history for responders.",
    safety_tip_fire_1: "Move away from smoke and fire immediately. Do not use lifts or elevators.",
    safety_tip_fire_2: "Stay low under smoke where the air is cooler and cleaner.",
    safety_tip_fire_3: "Never re-enter a burning building to retrieve belongings.",
    safety_tip_road_1: "Stay away from moving traffic and wait in a safe, visible spot on the sidewalk.",
    safety_tip_road_2: "Turn on vehicle hazard lights if possible to warn oncoming drivers.",
    safety_tip_road_3: "Do not move severely injured victims unless there is immediate risk of fire or collision.",
    safety_tip_flood_1: "Move to higher ground immediately and avoid walking or driving through floodwater.",
    safety_tip_flood_2: "Stay clear of fallen electrical poles, wires, and structurally damaged walls.",
    safety_tip_flood_3: "Keep a torch, drinking water, and fully charged phone ready while waiting for rescue.",
    safety_tip_rescue_1: "Stay in a stable, clear location away from falling debris or unstable structures.",
    safety_tip_rescue_2: "Make noise or signal with light if trapped, but avoid shouting unnecessarily to conserve energy.",
    safety_tip_rescue_3: "Keep access routes clear for the incoming rescue and search team.",
    safety_tip_gen_1: "Stay in a well-lit, populated location if possible until help arrives.",
    safety_tip_gen_2: "Keep your phone line free so the emergency crew or coordinator can call you.",
    safety_tip_gen_3: "Have someone watch for the vehicle and wave to guide responders to the exact scene.",

    // Call a Doctor
    call_doctor_title: "Call a Doctor",
    call_doctor_subtitle: "Connect with on-call medical triage or request an immediate doctor callback.",
    call_doctor_btn: "Request Urgent Doctor Call",
    call_doctor_direct_108: "Call 108 Medical Ambulance",
    call_doctor_notes_placeholder: "Describe patient condition or urgent symptoms (optional)",
    call_doctor_success: "Doctor call request submitted. Medical advisor will contact you shortly.",
    doctor_calling_unavailable: "Doctor calling is currently unavailable. For medical emergencies, dial 112 directly.",

    // Coordinator Persistent Notifications
    admin_notifications_title: "Coordinator Alerts",
    admin_notifications_mark_all: "Mark All as Read",
    admin_notifications_empty: "No coordinator notifications yet.",

    // Multi-factor Smart Allocation
    alloc_score_label: "Confidence Score",
    alloc_auto_dispatch: "Safe for Auto-Dispatch",
    alloc_admin_review: "Requires Coordinator Review",
    alloc_algorithm_badge: "Rule-Based Multi-Factor Scoring Engine",

    // Progressive Web App (PWA)
    pwa_install_app: "Install App",
    pwa_install_careon: "Install CareOn",
    pwa_banner_title: "Install CareOn on your device",
    pwa_banner_desc: "Add CareOn to your home screen for instant one-tap emergency access.",
    pwa_install_btn: "Install Now",
    pwa_dismiss_btn: "Not Now",
    pwa_ios_title: "Install CareOn on your iPhone",
    pwa_ios_subtitle: "Follow these simple steps in Safari to add CareOn to your home screen:",
    pwa_ios_step1: "1. Tap the Share button at the bottom of Safari.",
    pwa_ios_step2: "2. Scroll down and tap 'Add to Home Screen'.",
    pwa_ios_step3: "3. Tap 'Add' in the top-right corner to install.",
    pwa_instructions_close: "Got it",
    pwa_already_installed: "App Installed",
    pwa_android_other_title: "Add CareOn to Home Screen",
    pwa_android_other_desc: "Tap your browser menu (⋮) and select 'Install App' or 'Add to Home screen'.",
  },
  hi: {
    // Brand & Identity
    brand_name: "CareOn",
    brand_tagline: "मदद आपकी सोच से भी करीब है।",
    brand_subtitle: "बुद्धिमान आपातकालीन संसाधन समन्वय मंच",
    disclaimer_short: "CareOn आपातकालीन समन्वय निर्णय-समर्थन प्रोटोटाइप है। जीवन के तत्काल खतरे में हमेशा 112 या 108 डायल करें।",
    official_helpline_btn: "आपातकालीन हेल्पलाइन: 112 पर कॉल करें",

    // Navigation
    nav_home: "होम",
    nav_report: "आपातकाल की रिपोर्ट करें",
    nav_track: "अनुरोध ट्रैक करें",
    nav_user_portal: "उपयोगकर्ता पोर्टल",
    nav_user_dashboard: "मेरा डैशबोर्ड",
    nav_user_history: "मेरा इतिहास",
    nav_user_login: "उपयोगकर्ता लॉगिन",
    nav_user_register: "पंजीकरण करें",
    nav_admin_portal: "कमांड सेंटर",
    nav_admin_login: "प्रशासक लॉगिन",
    nav_privacy: "गोपनीयता और शर्तें",
    nav_logout: "लॉगआउट",
    nav_notifications: "सूचनाएं",
    system_online: "सिस्टम ऑनलाइन (लाइव)",
    system_connecting: "सिस्टम कनेक्ट हो रहा है...",
    citizen_portal: "नागरिक पोर्टल",
    login_link: "साइन इन करें",
    notifications_title: "सूचनाएं",
    hero_title: "हर सेकंड महत्वपूर्ण है। हम आपकी मदद के लिए हैं।",
    hero_subtitle: "आपातकाल की रिपोर्ट करें, समन्वित सहायता प्राप्त करें और प्रतिक्रिया के दौरान अपडेट रहें।",
    hero_report_btn: "आपातकाल की रिपोर्ट करें",
    hero_track_btn: "मेरा अनुरोध ट्रैक करें",
    hero_sahara_btn: "सहारा से बात करें",

    // Hero Section
    hero_headline: "हर सेकंड महत्वपूर्ण है। हम मदद के लिए यहाँ हैं।",
    hero_subheadline: "आपातकाल की रिपोर्ट करें, समन्वित विशेषज्ञ सहायता प्राप्त करें और प्रतिक्रिया के दौरान लगातार अपडेट रहें।",
    btn_report_emergency: "🚨 आपातकाल की रिपोर्ट करें",
    btn_track_my_request: "🔍 अनुरोध ट्रैक करें",
    btn_talk_to_sahara: "💬 सहारा से बात करें",
    hero_stat_conflict: "100% टकराव रोकथाम",
    hero_stat_fee: "₹0 प्लेटफ़ॉर्म शुल्क",
    hero_stat_coverage: "मैसूर और क्षेत्रीय कवरेज",

    // How CareOn Works
    how_it_works_heading: "CareOn कैसे कार्य करता है",
    how_it_works_subheading: "नागरिकों, आपातकालीन उत्तरदाताओं और साझेदार नेटवर्कों के बीच एक सुरक्षित, समन्वित सेतु।",
    step1_title: "1. आपातकाल की रिपोर्ट करें",
    step1_desc: "जीपीएस स्थान पहचान के साथ 30 सेकंड में श्रेणी, स्थिति और स्थान साझा करें।",
    step2_title: "2. CareOn स्थिति का आकलन करता है",
    step2_desc: "नियम-आधारित प्रणाली प्राथमिकता तय करती है और निकटवर्ती डुप्लिकेट रिपोर्टों की जांच करती है।",
    step3_title: "3. संसाधनों का समन्वय किया जाता है",
    step3_desc: "बिना किसी टकराव के विशेषज्ञ टीमों का मिलान करता है या बाहरी साझेदारों से संपर्क करता है।",
    step4_title: "4. सहायता और अपडेट ट्रैक करें",
    step4_desc: "लाइव उत्तरदाता प्रगति, आगमन का अनुमानित समय और पारदर्शी लागत सहमति देखें।",

    // Feature Cards
    features_heading: "व्यापक आपातकालीन समन्वय",
    feat_coordination_title: "बुद्धिमान आपातकालीन समन्वय",
    feat_coordination_desc: "तत्कालता का मूल्यांकन करता है और विशेष क्षमताओं (एएलएस एम्बुलेंस, ट्रॉमा यूनिट, फायर टेंडर) का मिलान करता है।",
    feat_shortage_title: "संसाधन कमी प्रबंधन",
    feat_shortage_desc: "जब नगर के संसाधन व्यस्त होते हैं, तो मंच कमी की पहचान करता है और सत्यापित साझेदारों का समन्वय करता है।",
    feat_external_title: "बाहरी सहायता समन्वय",
    feat_external_desc: "साझेदार अस्पतालों, निजी एम्बुलेंसों और गैर-सरकारी संगठनों को पहले प्राथमिकता रणनीति से जोड़ता है।",
    feat_tracking_title: "रीयल-टाइम घटना ट्रैकिंग",
    feat_tracking_desc: "रिपोर्ट प्राप्ति से लेकर सत्यापन, प्रेषण और समाधान तक चरण-दर-चरण प्रतिक्रिया देखें।",
    feat_sahara_title: "सहारा देखभाल साथी",
    feat_sahara_desc: "सहानुभूतिपूर्ण एआई साथी जो नागरिकों को मार्गदर्शन, रिपोर्टिंग और ट्रैकिंग में सुरक्षित सीमाओं के साथ मदद करता है।",
    feat_transparency_title: "पारदर्शी सेवा लागत",
    feat_transparency_desc: "CareOn हमेशा ₹0 शुल्क लेता है। बाहरी निजी प्रदाताओं के शुल्क के लिए उपयोगकर्ता की स्पष्ट सहमति आवश्यक है।",

    // Auth & Navigation
    user_login_title: "नागरिक पोर्टल लॉगिन",
    user_login_subtitle: "अपनी दर्ज की गई आपात स्थितियों, लाइव ट्रैकिंग और आपातकालीन अलर्ट तक पहुंचें।",
    user_register_title: "नागरिक खाता बनाएं",
    user_register_subtitle: "निजी आपातकालीन रिकॉर्ड बनाए रखने और समन्वित अपडेट प्राप्त करने के लिए पंजीकरण करें।",
    admin_login_title: "कमांड सेंटर लॉगिन",
    admin_login_subtitle: "आपातकालीन समन्वयकों और व्यवस्थापकों के लिए अधिकृत पहुंच।",
    admin_login_btn: "कमांड सेंटर में प्रवेश करें",
    email_label: "ईमेल पता",
    email_placeholder: "अपना ईमेल दर्ज करें",
    password_label: "पासवर्ड",
    password_placeholder: "एक सुरक्षित पासवर्ड बनाएं",
    confirm_password_label: "पासवर्ड की पुष्टि करें",
    confirm_password_placeholder: "अपने पासवर्ड की पुष्टि करें",
    full_name_label: "पूरा नाम",
    full_name_placeholder: "अपना पूरा नाम दर्ज करें",
    phone_label: "फ़ोन नंबर",
    phone_placeholder: "अपना फ़ोन नंबर दर्ज करें",
    sign_in_btn: "साइन इन करें",
    create_account_btn: "खाता बनाएं",
    demo_account_hint: "त्वरित मूल्यांकन डेमो क्रेडेंशियल्स",
    fill_demo_user: "नागरिक डेमो क्रेडेंशियल भरें",
    fill_demo_admin: "समन्वयक डेमो क्रेडेंशियल भरें",
    no_account_prompt: "क्या आपका खाता नहीं है?",
    register_link: "यहाँ पंजीकरण करें",
    already_have_account: "Already have an account?",
    coordinator_access_hint: "क्या आप आपातकालीन समन्वयक हैं?",
    admin_login_link: "समन्वयक लॉगिन",
    looking_for_user_portal: "क्या आप नागरिक पोर्टल तलाश रहे हैं?",
    fill_all_fields: "कृपया सभी आवश्यक फ़ील्ड भरें।",
    invalid_credentials: "अमान्य ईमेल या पासवर्ड।",
    admin_unauthorized: "पहुंच अस्वीकृत। व्यवस्थापक विशेषाधिकार आवश्यक हैं।",
    login_success: "लॉगिन सफल! पुनर्निर्देशित किया जा रहा है...",
    register_success: "खाता सफलतापूर्वक बनाया गया! पुनर्निर्देशित किया जा रहा है...",
    password_mismatch: "पासवर्ड मेल नहीं खाते।",
    loading: "लोड हो रहा है...",
    logout_btn: "सत्र से लॉगआउट करें",

    // User Dashboard
    authenticated_citizen_badge: "सत्यापित नागरिक खाता",
    welcome_back: "स्वागत है,",
    refresh_feed: "फ़ीड रीफ़्रेश करें",
    refresh: "रीफ़्रेश करें",
    feed_refreshed: "लाइव घटना डेटा के साथ फ़ीड सफलतापूर्वक रीफ़्रेश किया गया।",
    my_requests_title: "मेरी आपातकालीन घटनाएं",
    btn_report_new: "नया आपातकाल रिपोर्ट करें",
    no_incidents_title: "कोई सक्रिय आपातकालीन घटना नहीं",
    no_incidents_desc: "आपने अभी तक कोई आपातकालीन अनुरोध प्रस्तुत नहीं किया है। यदि आपको चिकित्सा, अग्नि या बचाव सहायता की आवश्यकता है, तो कभी भी घटना की रिपोर्ट करें।",
    track_incident_btn: "लाइव ट्रैक करें",
    recent_notifications: "मेरी सूचनाएं",
    no_notifications: "कोई नई सूचना नहीं है।",
    helpline_alert_title: "राष्ट्रीय आपातकालीन हेल्पलाइन",
    helpline_alert_desc: "तात्कालिक जानलेवा परिस्थितियों के लिए, सीधे 112 पर भी डायल करें।",
    dial_112_btn: "112 पर कॉल करें",
    feedback: "प्रतिक्रिया",

    // Home & Features
    how_it_works_title: "CareOn कैसे काम करता है",
    feature1_title: "त्वरित आपातकालीन प्रेषण",
    feature1_desc: "निकटतम केंद्रों से एएलएस एम्बुलेंस, ट्रॉमा टीमों, दमकल गाड़ियों और बचाव वाहनों का समन्वय करता है।",
    feature2_title: "बैकअप मदद और साझेदार नेटवर्क",
    feature2_desc: "यदि सरकारी एम्बुलेंस व्यस्त हैं, तो तुरंत सत्यापित निजी अस्पतालों और सहायकों से संपर्क करता है।",
    feature3_title: "सटीक वाहन आवंटन",
    feature3_desc: "वास्तविक समय लॉक सत्यापन के साथ यह सुनिश्चित करता है कि समवर्ती आपात स्थितियों में कोई भी वाहन दोहरा आवंटित न हो।",
    feature4_title: "स्मार्ट संसाधन योजना",
    feature4_desc: "जनसांख्यिकीय घनत्व, मौसम की स्थिति और रुझानों के आधार पर संसाधन मांग का अनुमान लगाता है।",
    feature5_title: "सुरक्षित और निजी आपातकालीन मदद",
    feature5_desc: "स्पैम को रोकने के लिए ओटीपी सत्यापन के साथ नागरिकों के स्वास्थ्य रिकॉर्ड पूरी तरह से गोपनीय रहते हैं।",
    feature6_title: "सहारा 24/7 एआई साथी",
    feature6_desc: "चौबीसों घंटे उपलब्ध संवेदनशील, बहुभाषी आपातकालीन सहायता सहायक।",
    zero_commission_title: "₹0 प्लेटफ़ॉर्म शुल्क — पारदर्शी आपातकालीन समन्वय",
    zero_commission_desc: "CareOn ₹0 प्लेटफ़ॉर्म शुल्क लेता है। यदि निजी प्रदाता शुल्क लेते हैं, तो समन्वयक नागरिक की स्पष्ट सहमति के लिए कोटेशन प्रस्तुत करते हैं।",

    // User Portal & Auth
    login_title_user: "नागरिक पोर्टल लॉगिन",
    login_subtitle_user: "अपनी रिपोर्ट की गई घटनाओं, ट्रैकिंग स्थिति और व्यक्तिगत सूचनाओं तक पहुंचें।",
    login_title_admin: "कमांड सेंटर समन्वयक लॉगिन",
    login_subtitle_admin: "आपातकालीन समन्वयकों और व्यवस्थापकों के लिए सुरक्षित अधिकृत पहुंच।",
    register_title: "नागरिक खाता बनाएं",
    register_subtitle: "व्यक्तिगत आपातकालीन रिकॉर्ड बनाए रखने और अपडेट प्राप्त करने के लिए पंजीकरण करें।",
    form_fullname: "पूरा नाम",
    form_email: "ईमेल पता",
    form_phone: "फ़ोन नंबर",
    form_password: "पासवर्ड",
    form_confirm_password: "पासवर्ड की पुष्टि करें",
    form_remember_me: "सत्र याद रखें",
    btn_sign_in: "साइन इन करें",
    btn_register: "खाता बनाएं",
    already_have_account: "पहले से खाता है? साइन इन करें",
    need_account: "खाता नहीं है? यहाँ पंजीकरण करें",
    admin_access_only: "कमांड सेंटर केवल अधिकृत समन्वयकों के लिए प्रतिबंधित है।",

    // User Dashboard
    user_dashboard_title: "नागरिक आपातकालीन डैशबोर्ड",
    user_welcome: "स्वागत है",
    user_active_requests: "सक्रिय आपातकालीन अनुरोध",
    user_no_active: "वर्तमान में आपका कोई सक्रिय आपातकालीन अनुरोध नहीं है।",
    user_quick_actions: "त्वरित आपातकालीन क्रियाएं",
    user_history_title: "मेरा घटना इतिहास",
    user_profile_card: "रिपोर्टर प्रोफ़ाइल",
    user_trust_status: "सत्यापन स्थिति",

    // Emergency Reporting Form
    report_title: "आपातकाल की सूचना दें",
    report_subtitle: "कृपया सही विवरण दें ताकि समन्वयक सही प्रतिक्रिया वाहन भेज सकें।",
    cat_select_label: "1. आपातकालीन श्रेणी चुनें *",
    desc_label: "2. क्या हुआ? (संक्षिप्त विवरण) *",
    desc_placeholder: "स्थिति का वर्णन करें (उदा., जंक्शन के पास दोपहिया दुर्घटना, घायल व्यक्ति बेहोश है)...",
    loc_label: "3. मैसूर में स्थान / लैंडमार्क *",
    loc_placeholder: "उदा., केआर अस्पताल गेट 2 के पास, सयाजी राव रोड, मैसूर",
    btn_use_gps: "📍 मेरा जीपीएस स्थान उपयोग करें",
    loc_detecting: "जीपीएस स्थान खोजा जा रहा है...",
    affected_label: "प्रभावित व्यक्तियों की संख्या *",
    help_label: "आवश्यक सहायता का प्रकार",
    help_placeholder: "उदा., ऑक्सीजन युक्त एम्बुलेंस, प्राथमिक उपचार, दमकल",
    contact_name_label: "संपर्क व्यक्ति का नाम *",
    contact_phone_label: "संपर्क फ़ोन नंबर *",
    disaster_details_label: "आवश्यक आपदा राहत सामग्री",
    disaster_details_placeholder: "उदा., पीने का पानी (500L), बचाव नौकाएं, भोजन के पैकेट",
    demo_otp_notice: "आपातकालीन सत्यापन: अपने संपर्क नंबर के लिए उत्पन्न इन-ऐप सत्यापन कोड दर्ज करें।",
    emergency_notice: "मदद मांगने से पहले: कृपया सही जानकारी साझा करें ताकि हम सही सहायता का समन्वय कर सकें। वास्तविक सहमति मिलने पर ही सशुल्क निजी सेवाओं की व्यवस्था की जाएगी। जानबूझकर झूठी रिपोर्टों पर समीक्षा की जा सकती है। आपकी सुरक्षा हमारी प्राथमिकता है। ❤️",
    btn_submit_report: "🚨 आपातकालीन रिपोर्ट भेजें",
    submitting_report: "आपातकाल सबमिट व वर्गीकृत किया जा रहा है...",

    // Categories
    cat_medical: "चिकित्सा आपातकाल",
    cat_medical_desc: "दिल का दौरा, सांस लेने में तकलीफ, गंभीर चोट, बेहोशी",
    cat_road_accident: "सड़क दुर्घटना",
    cat_road_accident_desc: "दोपहिया वाहन टकराव, वाहन दुर्घटना, सड़क पर घायल",
    cat_fire: "आग की घटना",
    cat_fire_desc: "इमारत में आग, धुआं, जहरीली गैस का रिसाव",
    cat_rescue: "बचाव अभियान",
    cat_rescue_desc: "इमारत ढहना, पानी में फंसे लोग, खोज और बचाव",
    cat_disaster: "आपदा / सामूहिक हताहत",
    cat_disaster_desc: "शहरी बाढ़, भारी जलभराव, बादल फटना, कई लोग फंसे",
    cat_safety: "सुरक्षा / अन्य",
    cat_safety_desc: "सार्वजनिक सुरक्षा संकट, भीड़ में भगदड़, प्राथमिक उपचार",

    // Incident Tracking
    track_title: "आपातकालीन अनुरोध ट्रैक करें",
    track_search_placeholder: "इंसिडेंट कोड दर्ज करें (उदा. CARE-2026-101)",
    btn_search_track: "अनुरोध ट्रैक करें",
    track_status_label: "वर्तमान स्थिति",
    track_reported_at: "रिपोर्ट समय",
    track_priority_label: "प्राथमिकता",
    track_assigned_unit: "तैनात आपातकालीन प्रतिक्रिया दल",
    track_eta_label: "आगमन का अनुमानित समय",
    track_cost_breakdown_title: "लागत पारदर्शिता और बाहरी सेवा विवरण",
    platform_fee_label: "CareOn प्लेटफ़ॉर्म शुल्क",
    platform_fee_val: "₹0.00 (सदैव निःशुल्क)",
    provider_quote_label: "बाहरी प्रदाता शुल्क अनुमान",
    subsidy_label: "सब्सिडी / एनजीओ प्रायोजन",
    net_payable_label: "प्रदाता को देय शुद्ध राशि",
    consent_pending_alert: "कृपया बाहरी सेवा शुल्क की समीक्षा करें और प्रेषण की सहमति दें।",
    btn_accept_quote: "✓ कोटेशन स्वीकार करें व टीम भेजें",
    btn_decline_quote: "✕ अस्वीकार करें (निःशुल्क विकल्प खोजें)",
    consent_approved_badge: "✓ रिपोर्टर द्वारा सहमति स्वीकृत",
    btn_contact_coordinator: "📞 समन्वयक से संपर्क करें (+91 821 244 5566)",
    btn_cancel_request: "✕ अनुरोध रद्द करें",
    cancel_modal_title: "आपातकालीन अनुरोध रद्द करें",
    cancel_modal_desc: "कृपया हमारे समन्वयक को कारण बताएं ताकि हम तैनात संसाधनों को अन्य तत्काल घटनाओं के लिए सुरक्षित रूप से मुक्त कर सकें।",
    cancel_reason_label: "रद्द करने का कारण *",
    cancel_reason_resolved: "आपात स्थिति सुलझ गई है",
    cancel_reason_independent: "स्वतंत्र रूप से मदद की व्यवस्था हो गई",
    cancel_reason_mistake: "गलती से अनुरोध सबमिट हो गया था",
    cancel_reason_other: "अन्य",
    cancel_details_label: "अतिरिक्त विवरण (वैकल्पिक)",
    btn_confirm_cancel: "रद्दीकरण की पुष्टि करें",
    btn_keep_active: "अनुरोध सक्रिय रखें",
    cancelling_text: "रद्द किया जा रहा है...",

    // Statuses
    status_received: "प्राप्त हुआ",
    status_verification_pending: "सत्यापन लंबित",
    status_verified: "सत्यापित",
    status_assistance_search: "सहायता की खोज",
    status_provider_contacted: "प्रदाता से संपर्क किया",
    status_awaiting_provider: "प्रदाता प्रतिक्रिया की प्रतीक्षा",
    status_awaiting_consent: "उपयोगकर्ता सहमति प्रतीक्षित",
    status_assignment_confirmed: "आवंटन स्वीकृत",
    status_team_dispatched: "टीम रवाना (डिस्पैच)",
    status_team_arrived: "टीम पहुंची",
    status_resolved: "समाधान संपन्न",
    status_cancelled: "रद्द किया गया",
    status_rejected: "अस्वीकृत",

    // Feedback
    feedback_title: "आपातकाल हल हुआ — अपनी प्रतिक्रिया साझा करें",
    feedback_subtitle: "अपना अनुभव साझा करने के लिए धन्यवाद। ❤️ आपकी प्रतिक्रिया CareOn को सभी के लिए बेहतर बनाती है।",
    feedback_rating_label: "समन्वय सेवा का मूल्यांकन करें (1 - 5 स्टार)",
    feedback_tags_label: "प्रतिक्रिया टैग",
    tag_easy_to_use: "उपयोग में आसान",
    tag_clear_updates: "स्पष्ट अपडेट",
    tag_helpful_coordination: "मददगार समन्वय",
    tag_slow_response: "धीमी प्रतिक्रिया",
    tag_other: "अन्य",
    feedback_comments_label: "लिखित टिप्पणी (वैकल्पिक)",
    btn_submit_feedback: "प्रतिक्रिया सबमिट करें",
    feedback_received: "प्रतिक्रिया प्राप्त हुई — धन्यवाद!",

    // Admin Command Centre
    admin_title: "आपातकालीन संचालन कमांड सेंटर",
    admin_subtitle: "मैसूर क्षेत्र में रीयल-टाइम घटना ट्राइएज, क्षमता मिलान, कमी अलर्ट और साझेदार समन्वय।",
    btn_refresh_feed: "🔄 फ़ीड रीफ्रेश करें",
    refreshing_feed: "लाइव डेटा रीफ्रेश हो रहा है...",
    feed_refreshed_toast: "लाइव फ़ीड बैकएंड से सिंक हो गया है।",
    admin_stat_active: "सक्रिय घटनाएं",
    admin_stat_critical: "गंभीर प्राथमिकता",
    admin_stat_fleet_avail: "उपलब्ध वाहन",
    admin_stat_shortages: "सक्रिय कमियां",
    admin_stat_registered_partners: "पंजीकृत साझेदार",
    admin_stat_resolved: "हल की गई घटनाएं",

    // Admin Sidebar Tabs
    tab_overview: "📊 अवलोकन",
    tab_incidents: "🚨 घटना कतार",
    tab_resources: "🚑 उपलब्ध बेड़ा",
    tab_allocations: "🧠 स्मार्ट आवंटन",
    tab_shortages: "⚠️ कमी अलर्ट",
    tab_providers: "🏥 बाहरी साझेदार",
    tab_map: "🗺️ मैसूर लाइव मैप",
    tab_simulation: "🎯 कमी चुनौती (डेमो)",
    tab_verification: "🔍 विश्वास व सत्यापन",
    tab_disaster: "🌊 आपदा राहत",
    tab_analytics: "📈 एनालिटिक्स व एमएल",

    // Admin Table Headers
    th_code: "इंसिडेंट कोड",
    th_category: "श्रेणी",
    th_location: "स्थान (मैसूर)",
    th_reporter: "रिपोर्टर विवरण",
    th_priority: "प्राथमिकता",
    th_status: "स्थिति",
    th_verification: "सत्यापन",
    th_actions: "कार्रवाई",
    btn_inspect: "जांचें",
    btn_verify_otp: "ओटीपी सत्यापित करें",
    btn_resolve: "हल करें",
    btn_release_fleet: "वाहन मुक्त करें",
    btn_allocate: "वाहन तैनात करें",

    // Sahara
    sahara_name: "सहारा",
    sahara_role: "आपकी देखभाल करने वाली आपातकालीन साथी",
    sahara_greeting: "नमस्ते! ❤️ मैं सहारा हूँ, आपकी देखभाल करने वाली आपातकालीन साथी। एक गहरी सांस लें। हम मिलकर हल निकालेंगे। क्या हुआ है?",
    sahara_disclaimer: "सहारा चिकित्सीय निदान नहीं दे सकती। जीवन के खतरे में तुरंत 112 डायल करें।",
    sahara_placeholder: "सहारा से पूछें या घटना कोड दर्ज करें...",

    // Notifications
    notif_title: "सूचना केंद्र",
    notif_empty: "कोई नई सूचना नहीं है। रीयल-टाइम अपडेट यहाँ दिखाई देंगे।",
    notif_mark_read: "पढ़ा हुआ मार्क करें",

// Additional Global / Header / Navigation
    nav_admin: "कमांड सेंटर",
    command_centre_title: "कमांड सेंटर",
    command_centre_subtitle: "मैसूरु भर में रीयल-टाइम आपातकालीन घटना छंटाई, क्षमता मिलान, संसाधन कमी अलर्ट और भागीदार समन्वय।",
    admin_role: "समन्वयक",
    refreshing: "ताज़ा हो रहा है...",
    reset_demo_state: "सिमुलेशन रीसेट करें",
    built_with_care: "आपातकालीन निर्णय-समर्थन के लिए विशेष रूप से निर्मित।",
    quick_links: "पोर्टल और सेवाएं",
    command_support_title: "समन्वयक सहायता",
    disclaimer_title: "आपातकालीन सूचना",
    footer_disclaimer: "CareOn एक बुद्धिमान आपातकालीन संसाधन समन्वय निर्णय-समर्थन प्रोटोटाइप है। यह आधिकारिक सरकारी आपातकालीन सेवाओं का विकल्प नहीं है। तत्काल जीवन-खतरे वाली स्थितियों के लिए हमेशा सीधे 112 डायल करें।",
    
    // Admin Metric Cards
    stat_active_incidents: "सक्रिय घटनाएं",
    stat_critical_priority: "गंभीर प्राथमिकता",
    stat_fleet_available: "उपलब्ध वाहन",
    stat_active_shortages: "सक्रिय कमियां",

    // Home / Hero / Workflow / Features
    hero_badge: "बुद्धिमान संसाधन समन्वय",
    workflow_subtitle: "सहज आपातकालीन समन्वय यात्रा",
    how_it_works_desc: "नागरिकों, प्रेषण समन्वयकों और आपातकालीन प्रतिक्रिया टीमों के बीच एक स्वचालित सेतु।",
    platform_capabilities_badge: "मजबूती और तत्परता के लिए निर्मित",
    features_section_title: "व्यापक आपातकालीन संसाधन समन्वय",
    features_section_desc: "संसाधन की कमी को रोकने, टकराव समाप्त करने और तीव्र प्रतिक्रिया सुनिश्चित करने के लिए डिज़ाइन किया गया।",
    
    // Report Emergency Page
    report_emergency_title: "आपातकाल की रिपोर्ट करें",
    report_emergency_desc: "मुख्य घटना विवरण दर्ज करें। CareOn निकटतम उपयुक्त चिकित्सा, अग्नि या बचाव दल का समन्वय करता है।",
    emergency_category_label: "आपातकालीन श्रेणी चुनें",
    what_happened_label: "क्या हुआ? (संक्षिप्त विवरण)",
    location_label: "मैसूरु में स्थान / लैंडमार्क",
    location_placeholder: "उदा. केआर अस्पताल के पास, सयाजी राव रोड, मैसूरु",
    use_my_location: "मेरा जीपीएस स्थान उपयोग करें",
    locating: "जीपीएस खोज रहा है...",
    affected_people_label: "प्रभावित लोग",
    help_required_label: "आवश्यक सहायता का प्रकार",
    disaster_supplies_label: "सामूहिक आपदा राहत सामग्री",
    disaster_placeholder: "उदा. पीने का पानी, बचाव नावें, अस्थायी आश्रय",
    contact_name_label: "आपका / संपर्ककर्ता का नाम",
    contact_phone_label: "संपर्क फोन नंबर",
    submit_emergency_btn: "आपातकालीन अनुरोध दर्ज करें",
    submitting: "अनुरोध दर्ज हो रहा है...",
    demo_otp_title: "आपातकालीन संपर्क सत्यापन",
    demo_otp_desc: "सबमिट करने पर आपके संपर्क नंबर के लिए एक आपातकालीन सत्यापन कोड उत्पन्न होता है।",
    pre_authorized: "सिम्युलेटेड सत्यापन",
    report_failed: "आपातकालीन रिपोर्ट दर्ज करने में विफल।",
    err_desc_required: "कृपया घटना का संक्षिप्त विवरण दें (कम से कम 5 अक्षर)।",
    err_loc_required: "कृपया स्थान या लैंडमार्क निर्दिष्ट करें।",
    err_contact_required: "संपर्ककर्ता का नाम और फोन नंबर आवश्यक है।",
    invalid_phone: "कृपया वैध फोन नंबर दर्ज करें (कम से कम 8 अंक)।",
    geo_not_supported: "आपके ब्राउज़र में जियोलोकेशन समर्थित नहीं है।",

    // Incident Category Descriptions
    cat_desc_medical: "हृदय रोग, सांस की तकलीफ, गंभीर चोट, आघात",
    cat_desc_road: "वाहन टक्कर, फंसे हुए यात्री, सड़क दुर्घटना",
    cat_desc_fire: "भवन आग, धुआं, गैस सिलेंडर रिसाव",
    cat_desc_rescue: "इमारत गिरना, डूबना, फंसे हुए पीड़ित",
    cat_desc_disaster: "भीषण बाढ़, तूफान, सामूहिक हताहत घटना",
    cat_desc_safety: "सार्वजनिक सुरक्षा संकट, भीड़ का खतरा, प्राथमिक चिकित्सा",

    // Track Request Page
    track_request_title: "आपातकालीन अनुरोध ट्रैक करें",
    track_input_placeholder: "इंसिडेंट कोड दर्ज करें (उदा. CARE-2026-101)",
    track_request_btn: "अनुरोध ट्रैक करें",
    incident_not_found: "घटना नहीं मिली",
    incident_privacy_restricted: "यह घटना रिकॉर्ड निजी है और किसी अन्य उपयोगकर्ता का है।",
    assigned_unit_title: "आवंटित आपातकालीन प्रतिक्रिया दल",
    eta: "अनुमानित आगमन समय",
    timeline_title: "लाइव गतिविधि और ऑडिट समयरेखा",
    awaiting_updates: "प्रारंभिक समन्वयक अपडेट की प्रतीक्षा की जा रही है...",
    cost_transparency_title: "लागत पारदर्शिता और बाहरी प्रदाता विवरण",
    platform_fee_free: "₹0.00 (हमेशा निःशुल्क)",
    free_public_resources: "कोई बाहरी सशुल्क प्रदाता नहीं। मानक सार्वजनिक संसाधन बिना किसी शुल्क के तैनात हैं।",
    consent_required_msg: "बाहरी निजी प्रदाता सेवा के लिए आपकी स्पष्ट सहमति आवश्यक है।",
    consent_accepted: "नागरिक द्वारा स्वीकृत",
    accept_quote: "कोटेशन स्वीकार करें और प्रेषण की पुष्टि करें",
    decline_quote: "अस्वीकार करें (मुफ्त विकल्प खोजें)",
    confirm_cancellation: "रद्दीकरण की पुष्टि करें",
    cancel_details_placeholder: "उदा. स्थानीय डॉक्टर आ गए हैं, मरीज अब स्थिर है...",
    reason_arranged_independently: "सहायता स्वतंत्र रूप से व्यवस्थित हो गई",
    reason_mistake: "अनुरोध गलती से सबमिट हो गया था",
    reason_resolved: "आपातकाल सुलझ गया है",
    reason_other: "अन्य कारण",
    keep_active: "सक्रिय रखें",
    contact_coordinator: "कमांड समन्वयक से संपर्क करें",
    additional_details: "अतिरिक्त विवरण (वैकल्पिक)",
    reported_at: "रिपोर्ट समय",
    category: "प्रकार",
    emergency_resolved_title: "आपातकाल हल हुआ — अपनी प्रतिक्रिया साझा करें",
    rate_coordination: "आप आपातकालीन समन्वय को क्या रेटिंग देंगे? (1 - 5 सितारे)",
    rating_label: "रेटिंग (1 - 5 सितारे)",
    written_comments: "लिखित टिप्पणियां (वैकल्पिक)",
    feedback_comments_placeholder: "प्रतिक्रिया गति, स्पष्टता या समन्वयक सहायता पर अपने विचार साझा करें...",
    feedback_intro: "अपना अनुभव साझा करने के लिए धन्यवाद। आपकी प्रतिक्रिया CareOn को बेहतर बनाती है।",
    feedback_thanks: "धन्यवाद! आपकी रेटिंग गुणवत्ता डेटाबेस में दर्ज कर ली गई है।",
    submit_feedback_title: "प्रतिक्रिया समन्वय को रेट करें",

    // User Dashboard Actions
    my_dashboard: "मेरा डैशबोर्ड",
    user_action_report_desc: "जीपीएस के साथ तत्काल चिकित्सा, अग्नि या दुर्घटना आपातकाल दर्ज करें।",
    user_action_track_desc: "रीयल-टाइम प्रेषण प्रगति, प्रतिक्रिया दल का समय और नोट्स देखें।",
    user_action_sahara_desc: "आपातकालीन मार्गदर्शन, प्राथमिक उपचार या हेल्पलाइन सहायता के लिए सहारा से बात करें।",
    resource_dispatched: "प्रतिक्रिया दल रवाना किया गया",

    // Sahara Chatbot
    sahara_tagline: "आपकी देखभाल करने वाली आपातकालीन साथी",
    sahara_intro: "नमस्ते! ❤️ मैं सहारा हूं, आपकी देखभाल करने वाली आपातकालीन साथी। गहरी सांस लें — मदद आपके करीब है। बताएं क्या हुआ या इंसिडेंट कोड दर्ज करें।",
    sahara_typing: "सहारा टाइप कर रही है...",
    ask_sahara_placeholder: "सहारा से पूछें या इंसिडेंट कोड दर्ज करें...",
    safe_companion: "सुरक्षित साथी",
    sahara_offline_reply: "मैं आपके साथ हूं। ❤️ नेटवर्क में थोड़ी रुकावट आई, पर यदि तत्काल सहायता चाहिए तो कृपया 'रिपोर्ट आपातकाल' पर क्लिक करें या सीधे 112 डायल करें।",

    // Auth & General
    admin_login_success: "प्रमाणीकरण सफल! कमांड सेंटर पर पुनर्निर्देशित किया जा रहा है...",
    demo_admin_credentials_hint: "डेमो समन्वयक खाता",
    registration_failed: "पंजीकरण विफल रहा।",
    invalid_email: "कृपया एक वैध ईमेल पता दर्ज करें।",
    password_too_short: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
    name_required: "पूरा नाम आवश्यक है।",
    submit: "जमा करें",
    cancel: "रद्द करें",
    comments_label: "टिप्पणियां या समन्वयक नोट्स",
    faq_categories_question: "कौन सी आपातकालीन श्रेणियां समर्थित हैं?",
    faq_charge_question: "क्या CareOn समन्वय के लिए कोई शुल्क लेता है?",
    // Privacy Policy
    privacy_title: "गोपनीयता, शर्तें और जिम्मेदार प्रोटोटाइप प्रकटीकरण",
    privacy_updated: "अंतिम अद्यतन: प्रोटोटाइप प्रदर्शन संस्करण 2026",
    privacy_sec1_title: "1. शैक्षिक निर्णय-समर्थन प्रोटोटाइप सूचना",
    privacy_sec1_desc: "CareOn एक बुद्धिमान आपातकालीन संसाधन समन्वय प्रोटोटाइप है जिसे शैक्षणिक प्रदर्शन और संकाय समीक्षा के लिए विकसित किया गया है। CareOn कोई आधिकारिक आपातकालीन सेवा, नगरपालिका 911/112 ऑपरेटर, पुलिस सेवा या सरकारी आपातकालीन डिस्पैचर का प्रतिस्थापन नहीं है।",
    privacy_sec2_title: "2. लागत पारदर्शिता और ₹0 प्लेटफ़ॉर्म शुल्क",
    privacy_sec2_desc: "CareOn आपातकालीन सहायता का अनुरोध करने के लिए नागरिकों से कोई कमीशन या प्लेटफ़ॉर्म शुल्क नहीं लेता है। यदि प्लेटफ़ॉर्म संसाधन अनुपलब्ध हैं और किसी बाहरी निजी प्रदाता को शामिल किया जाता है, तो समन्वयक पारदर्शी रूप से उद्धरण प्रदर्शित करता है और सशुल्क सहायता भेजने से पहले उपयोगकर्ता की सूचित सहमति मांगता है।",
    privacy_sec3_title: "3. डेटा प्रतिधारण और जिम्मेदार प्रबंधन",
    privacy_sec3_item1: "संपर्क विवरण और निर्देशांक केवल प्रासंगिक विशेषज्ञ सहायता के समन्वय के लिए एकत्र किए जाते हैं।",
    privacy_sec3_item2: "पासवर्ड PBKDF2-HMAC-SHA256 साल्ट के साथ एन्क्रिप्ट किए गए हैं।",
    privacy_sec3_item3: "सीडेड प्रदर्शनों में सभी फ़ोन नंबर सुरक्षित काल्पनिक डेमो नंबर हैं।",
    privacy_sec3_item4: "सामान्य उपयोगकर्ता किसी अन्य उपयोगकर्ता के निजी घटना विवरण का निरीक्षण नहीं कर सकते हैं।",
    privacy_sec3_item5: "प्रशासकों के पास ऑडिट लॉगिंग के साथ भूमिका-संरक्षित कमांड सेंटर पहुंच है।",
    privacy_sec4_title: "4. सहारा आपातकालीन साथी सीमाएं",
    privacy_sec4_desc: "सहारा एक नियम-आधारित एआई साथी है जिसे सहायक मार्गदर्शन प्रदान करने और आपातकालीन अनुरोधों को ट्रैक करने में मदद करने के लिए डिज़ाइन किया गया है। सहारा चिकित्सा स्थितियों का निदान नहीं करता है, दवाएं नहीं लिखता है, या आगमन समय का आविष्कार नहीं करता है। तत्काल जीवन के खतरों के लिए, नागरिकों को आधिकारिक आपातकालीन हेल्पलाइन (112/108) पर निर्देशित किया जाता है।",

    // Notification Drawer
    notification_centre_title: "अधिसूचना केंद्र",
    no_notifications_desc: "अभी तक कोई सूचना नहीं है। अद्यतन यहाँ वास्तविक समय में दिखाई देंगे।",
    mark_read: "पढ़ा हुआ चिह्नित करें",
    dismiss: "खारिज करें",
    view_in_drawer: "बेल में देखें",
    refresh_failed: "सर्वर से लाइव डेटा रीफ़्रेश करने में विफल।",
    updated_just_now: "अभी अपडेट किया गया",
    acknowledge_alert: "स्वीकार करें और म्यूट करें",
    new_emergency_alert: "🚨 नया आपातकालीन अलर्ट: तत्काल कार्रवाई आवश्यक",
    alert_acknowledged: "अलर्ट स्वीकार किया गया और म्यूट कर दिया गया।",
    sound_enabled: "ध्वनि: चालू",
    sound_disabled: "ध्वनि: बंद",
    view_incident_triage: "देखें और ट्राइएज करें",

    // Admin Dashboard Sections & Cards
    active_incident_queue_title: "सक्रिय आपातकालीन प्राथमिकता कतार",
    btn_view_all: "सभी देखें",
    fleet_availability_title: "बेड़े की उपलब्धता और तत्काल कमी",
    fleet_categories_label: "बेड़ा श्रेणियां:",
    critical_shortage_detected: "⚠️ गंभीर कमी का पता चला:",
    incident_mgmt_title: "आपातकालीन प्रबंधन और सत्यापन कतार",
    duplicate_flag_badge: "डुप्लिकेट फ्लैग",
    fleet_mgmt_title: "आपातकालीन बेड़ा प्रबंधन",
    fleet_mgmt_desc: "वाहन उपलब्धता, रखरखाव की स्थिति और सक्रिय असाइनमेंट की निगरानी करें। डेटाबेस लेनदेन स्तर पर दोहराव को रोका जाता है।",
    smart_allocation_engine_title: "स्मार्ट संसाधन आवंटन इंजन",
    smart_allocation_engine_desc: "टकराव की रोकथाम करते हुए घटना की गंभीरता, क्षमता मिलान और यात्रा के समय का मूल्यांकन करता है।",
    active_shortages_mgmt_title: "सक्रिय संसाधन कमी प्रबंधन",
    active_shortages_mgmt_desc: "जब शहर के बेड़े के संसाधन समाप्त हो जाते हैं, तो CareOn बाहरी साझेदार अस्पतालों या निजी एम्बुलेंसों को शामिल करने की सिफारिश करता है।",
    no_active_shortages_msg: "✓ इस समय कोई सक्रिय बेड़ा कमी नहीं है। सभी सक्रिय कॉलों के पास प्रतिक्रिया इकाइयां उपलब्ध हैं।",
    external_providers_dir_title: "पंजीकृत साझेदार और बाहरी प्रदाता निर्देशिका",
    external_providers_dir_desc: "CareOn साझेदार-प्राथमिकता रणनीति के साथ कार्य करता है। बाहरी प्रदाता के उद्धरण के लिए नागरिक की सहमति आवश्यक है।",
    registered_partner_badge: "पंजीकृत साझेदार",
    fallback_dir_badge: "बैकअप निर्देशिका",
    live_map_dispatch_title: "लाइव भौगोलिक प्रेषण और ट्रैकिंग",
    live_map_dispatch_desc: "सक्रिय आपातकालीन पिन, उपलब्ध इकाइयों और साझेदार सुविधाओं को प्रदर्शित करता हुआ ओपनस्ट्रीटमैप विज़ुअलाइज़ेशन।",
    simulation_expo_title: "🎯 संसाधन कमी चुनौती — इंटरैक्टिव वॉकथ्रू",
    simulation_expo_desc: "यह इंटरैक्टिव वॉकथ्रू CareOn की मुख्य समन्वय क्षमताओं को प्रदर्शित करता है: बहु-घटना प्राथमिकता, टकराव की रोकथाम, कमी का पता लगाना और बाहरी प्रदाता समन्वय।",
    trust_review_title: "रिपोर्टर सत्यापन और विश्वास समीक्षा",
    trust_review_desc: "CareOn जानबूझकर दुरुपयोग को रोकने के लिए विश्वास संकेतों (फ़ोन प्रारूप, ओटीपी, निकटता डुप्लिकेट, इतिहास) का आकलन करता है।",
    disaster_mgmt_title: "🌊 आपदा प्रबंधन और सामूहिक हताहत विस्तार",
    disaster_mgmt_desc: "शहरी बाढ़ या संरचनात्मक पतन के लिए आपूर्ति (भोजन, पेयजल, टेंट) और समन्वय का प्रबंधन।",
    available_relief_assets_title: "उपलब्ध राहत संपत्तियां",
    ml_predictor_title: "📊 नियम-आधारित संसाधन कमी जोखिम भविष्यवक्ता",
    ml_predictor_desc: "ज़ोन, समय के अनुसार मांग में वृद्धि और सक्रिय बेड़े के बफर की गणना करता है।",
    ml_predictor_notice: "सूचना: समन्वयक निर्णय समर्थन के लिए नियम-आधारित मांग अनुमान मॉडल। आधिकारिक नगरपालिका आपातकालीन पूर्वानुमान नहीं।",

    // Badges & Verifications
    flagged_duplicate_badge: "फ्लैग किया गया निकटता डुप्लिकेट",
    unique_incident_badge: "✓ विशिष्ट आपातकाल",
    genuine_incident_badge: "वास्तविक आपातकाल",
    awaiting_otp_label: "ओटीपी की प्रतीक्षा है",
    verified_label: "✓ सत्यापित",

    // KPIs
    kpi_avg_rating: "औसत समन्वयक रेटिंग",
    kpi_from_reviews: "14 सत्यापित रिपोर्टर समीक्षाओं से",
    kpi_avg_eta: "अनुमानित औसत आगमन समय (ETA)",
    kpi_eta_context: "1.25x ट्रैफ़िक कारक वाला शहरी गलियारा",
    kpi_conflict_rate: "टकराव रोकथाम दर",
    kpi_zero_double: "0 दोहराव दर्ज किया गया",

    // Admin Details Modal
    lbl_category: "श्रेणी",
    lbl_description: "विवरण",
    lbl_location: "स्थान",
    lbl_casualties: "हताहत / प्रभावित",
    lbl_help_requested: "अनुरोधित सहायता",
    lbl_contact: "संपर्क",
    lbl_initial_priority_reason: "प्रारंभिक प्राथमिकता कारण",
    lbl_coordinator_priority_adj: "समन्वयक प्राथमिकता समायोजन",
    lbl_available_fleet_units: "उपलब्ध बेड़ा इकाइयां (प्रत्यक्ष असाइनमेंट):",

    // Table Headers
    th_verified: "सत्यापित",
    th_incident_code: "घटना कोड",
    th_contact_person: "संपर्क व्यक्ति",
    th_phone_number: "फ़ोन नंबर",
    th_otp_status: "ओटीपी स्थिति",
    th_duplicate_check: "डुप्लिकेट जाँच",
    th_trust_decision: "विश्वास निर्णय",
    th_zone: "भौगोलिक क्षेत्र",
    th_predicted_risk: "अनुमानित कमी जोखिम",
    th_risk_score: "जोखिम स्कोर",
    th_resource_in_demand: "मांग में संसाधन",
    th_time_context: "समय संदर्भ",
    th_recommended_action: "अनुशंसित समन्वयक कार्रवाई",

    // Buttons
    btn_details: "विवरण",
    btn_mark_available: "उपलब्ध चिह्नित करें",
    btn_set_maintenance: "रखरखाव सेट करें",
    btn_simulate_partner_contact: "साझेदार संपर्क अनुकरण करें",
    btn_simulate_contact_quote: "संपर्क और उद्धरण अनुकरण करें",
    btn_pause_movement: "⏸ आंदोलन अनुकरण रोकें",
    btn_simulate_movement: "▶ लाइव प्रेषण आंदोलन अनुकरण करें",
    btn_reset_scenario: "↺ परिदृश्य को चरण 1 पर रीसेट करें",
    btn_assign_prefix: "+ असाइन करें",
    btn_dispatch_relief_van: "आपदा राहत आपूर्ति वैन 01 भेजें",
    btn_save_priority_change: "प्राथमिकता परिवर्तन सहेजें",

    // Simulation Steps
    sim_step1_title: "चरण 1: कई समकालिक आपात स्थिति लोड की गई",
    sim_step1_desc: "मैसूर भर में तीन समकालिक आपात स्थिति सक्रिय हैं (सयाजी राव रोड कार्डियक अरेस्ट, कुवेम्पुनगर सड़क दुर्घटना, और गोकुलम रसोई की आग)।",
    sim_step2_title: "चरण 2: बेड़े की कमी (केवल 1 एम्बुलेंस उपलब्ध)",
    sim_step2_desc: "एम्बुलेंस 01 CARE-2026-101 को सौंपी गई है। एम्बुलेंस 03 रखरखाव में है। सक्रिय बेड़े में केवल सिटीकेयर एम्बुलेंस 02 शेष है।",
    sim_step3_title: "चरण 3: आवंटन चलाएं और टकराव रोकथाम प्रदर्शित करें",
    sim_step3_desc: "स्मार्ट आवंटक शेष एम्बुलेंस को उच्चतम प्राथमिकता वाली कॉल को सौंपता है। सिस्टम व्यस्त एम्बुलेंस को किसी अन्य सक्रिय घटना को सौंपने से रोकता है।",
    sim_step4_title: "चरण 4: कमी चेतावनी और साझेदार पूछताछ",
    sim_step4_desc: "CARE-2026-103 एक गंभीर बेड़े की कमी का अनुभव करता है। पंजीकृत साझेदार से संपर्क करें और उद्धरण (₹1,500) दर्ज करें।",

    // Quotation & Tracking Labels
    lbl_ext_quotation: "बाहरी साझेदार उद्धरण",
    lbl_subsidy_amount: "सब्सिडी / एनजीओ प्रायोजन",
    lbl_net_payable: "सेवा प्रदाता को देय शुद्ध राशि",
    contact_label: "संपर्क",
    mins_label: "मिनट",

    // Badges & Common
    urgent_badge: "अत्यावश्यक",
    live_badge: "लाइव",
    ai_badge: "24/7 एआई",
    sahara_safe_companion_desc: "सहारा समन्वय सहायता प्रदान करती है। जीवन के तत्काल खतरे में तुरंत 112 डायल करें।",
    backend_service_status: "बैकएंड सेवा स्थिति",
    role_admin: "प्रशासक",
    role_user: "उपयोगकर्ता",
    language_selector: "भाषा चयनकर्ता",
    national_helpline_label: "राष्ट्रीय हेल्पलाइन",
    coordination_email_label: "समन्वय",
    mysuru_command_region: "मैसूर कमांड क्षेत्र, कर्नाटक, भारत",

    // Map Picker & Legend
    map_picker_hint: "📍 सटीक मैसूर निर्देशांक चुनने के लिए मानचित्र पर क्लिक करें या पिन खींचें",
    lat_label: "अक्षांश",
    lon_label: "देशांतर",
    map_legend_incidents: "आपातकालीन घटनाएं",
    map_legend_available: "उपलब्ध बेड़ा",
    map_legend_dispatched: "भेजी गई इकाइयां",
    map_legend_partners: "साझेदार अस्पताल और एनजीओ",
    map_simulation_active: "वाहन आंदोलन सक्रिय",
    map_center_label: "मैसूर शहर क्षेत्र (12.3052° N, 76.6552° E)",

    // Notification Titles & System Terms
    "Emergency Request Received": "आपातकालीन अनुरोध प्राप्त हुआ",
    "Ambulance Dispatched": "एम्बुलेंस रवाना की गई",
    "Assistance Search Started": "सहायता खोज शुरू हुई",
    "Provider Contacted": "प्रदाता से संपर्क किया गया",
    "Provider Quoted": "प्रदाता ने उद्धरण दिया",
    "Consent Accepted": "सहमति स्वीकार की गई",
    "Incident Resolved": "घटना हल हो गई",
    "Request Cancelled": "अनुरोध रद्द किया गया",
    "Cancellation Acknowledged": "रद्दीकरण स्वीकार किया गया",
    "Emergency OTP Verified": "आपातकालीन ओटीपी सत्यापित",
    "Medical Tele-triage Callback Requested": "मेडिकल टेली-ट्राइएज कॉलबैक का अनुरोध किया गया",
    "Doctor Callback Status Updated": "डॉक्टर कॉलबैक स्थिति अपडेट की गई",
    "New Incident Reported": "नई आपातकालीन घटना दर्ज की गई",
    "Incident Needs Review": "घटना की समीक्षा आवश्यक है",
    "Shortage Alert": "संसाधन कमी चेतावनी",
    "Duplicate Flagged": "डुप्लिकेट फ्लैग किया गया",
    "Urgent Action Required": "अत्यावश्यक कार्रवाई आवश्यक है",
    "Under Maintenance": "रखरखाव में",
    "Available": "उपलब्ध",
    "Assigned": "असाइन किया गया",
    "Dispatched": "रवाना किया गया",
    "System": "सिस्टम",
    "Coordinator": "समन्वयक",
    "Reporter": "रिपोर्टर",


    // Stage 5 & 6: Sahara Voice & Personalized Greetings
    voice_input_tooltip: "आवाज़ इनपुट (सहारा से बोलें)",
    voice_listening: "सुन रहा है... अब बोलें",
    voice_unsupported: "इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है",
    voice_permission_error: "माइक्रोफ़ोन एक्सेस अस्वीकृत या अनुपलब्ध है",
    personalized_greeting_prefix: "नमस्ते",

    // Stage 5 & 6: Simulated In-App OTP Verification
    otp_verification_title: "आपातकालीन संपर्क सत्यापन (सिम्युलेटेड इन-ऐप ओटीपी)",
    otp_verification_desc: "आपके संपर्क नंबर के लिए एक सुरक्षित सत्यापन कोड उत्पन्न किया गया है। इस रिपोर्ट की पुष्टि करने के लिए नीचे 6 अंकों का कोड दर्ज करें।",
    simulated_otp_display: "सिम्युलेटेड कोड:",
    enter_otp_placeholder: "6 अंकों का कोड दर्ज करें",
    btn_verify_otp: "कोड सत्यापित करें",
    btn_request_new_otp: "नया कोड प्राप्त करें",
    otp_verified_badge: "✓ फ़ोन संपर्क सत्यापित",
    otp_verifying: "सत्यापित हो रहा है...",
    otp_success_msg: "आपातकालीन संपर्क फ़ोन सफलतापूर्वक सत्यापित किया गया।",

    // Stage 5 & 6: Doctor Tele-Triage Callback
    doctor_callback_title: "डॉक्टर टेली-ट्राइएज कॉलबैक",
    doctor_callback_desc: "प्रतिक्रिया दल के समन्वय के दौरान एक ऑन-कॉल चिकित्सा सलाहकार से टेली-ट्राइएज परामर्श का अनुरोध करें।",
    btn_request_callback: "डॉक्टर कॉलबैक का अनुरोध करें",
    chief_complaint_label: "मुख्य लक्षण / तात्कालिक समस्या",
    chief_complaint_placeholder: "मरीज़ की स्थिति का वर्णन करें (उदा. सीने में जकड़न, सांस लेने में तकलीफ)...",
    callback_disclaimer: "डॉक्टर कॉलबैक तात्कालिक मार्गदर्शन प्रदान करता है। तीव्र, जानलेवा खतरे के लिए तुरंत 112 डायल करें।",
    callback_status_pending: "कॉलबैक का अनुरोध किया गया (समीक्षा लंबित)",
    callback_status_in_progress: "कॉलबैक प्रगति पर है (डॉक्टर संपर्क कर रहे हैं)",
    callback_status_contacted: "चिकित्सा सलाहकार द्वारा नागरिक से संपर्क किया गया",
    callback_status_completed: "टेली-ट्राइएज परामर्श पूरा हुआ",
    tab_doctor_callbacks: "🩺 डॉक्टर कॉलबैक",
    th_chief_complaint: "मुख्य शिकायत",
    th_callback_status: "कॉलबैक स्थिति",
    btn_mark_in_progress: "प्रगति में चिह्नित करें",
    btn_mark_contacted: "संपर्क किया गया चिह्नित करें",
    btn_mark_completed: "पूर्ण चिह्नित करें",

    // Stage 5 & 6: Official Direct Emergency Line
    direct_emergency_line: "आधिकारिक आपातकालीन सेवाएं",

    // Arrival Tracker
    arrival_tracker_title: "मदद रास्ते में है!",
    arrival_tracker_subtitle: "आपका आपातकालीन वाहन रवाना हो चुका है और आपके स्थान की ओर आ रहा है।",
    arrival_tracker_eta: "अनुमानित आगमन",
    arrival_tracker_mins: "मिनट",
    arrival_tracker_unit: "आवंटित वाहन",
    arrival_tracker_demo_badge: "डेमो सिमुलेशन",
    arrival_tracker_live_badge: "लाइव जीपीएस",
    arrival_confirm_btn: "पुष्टि करें कि मदद पहुंच गई",
    arrival_confirm_dialog: "क्या आपातकालीन सहायता आपके स्थान पर पहुंच गई है?",
    arrival_stage_received: "अनुरोध प्राप्त हुआ",
    arrival_stage_dispatched: "वाहन रवाना हुआ",
    arrival_stage_enroute: "रास्ते में है",
    arrival_stage_arrived: "घटनास्थल पर पहुंचे",
    arrival_tracker_map_preview: "लाइव रूट पूर्वावलोकन",
    enlarge_map_btn: "नक्शा बड़ा करें",
    close_map_btn: "नक्शा बंद करें",
    enlarged_map_title: "आपातकालीन प्रतिक्रिया मार्ग और ट्रैकर",
    stay_safe_title: "मदद आने तक सुरक्षित रहें",
    safety_tips_paused: "बातचीत पर रुका हुआ",
    safety_tip_med_1: "व्यक्ति को आरामदायक स्थिति में रखें और गंभीर चोट होने पर अनावश्यक हलचल से बचें।",
    safety_tip_med_2: "व्यक्ति के आसपास खुली हवा सुनिश्चित करें और तंग कपड़े ढीले करें।",
    safety_tip_med_3: "शांत रहें, अपनी फोन लाइन खाली रखें और ज्ञात मेडिकल इतिहास तैयार रखें।",
    safety_tip_fire_1: "धुएं और आग से तुरंत दूर हटें। लिफ्ट का उपयोग बिल्कुल न करें।",
    safety_tip_fire_2: "धुएं के नीचे झुककर रहें जहां हवा ठंडी और अधिक सांस लेने योग्य होती है।",
    safety_tip_fire_3: "सामान लेने के लिए कभी भी जलती हुई इमारत में वापस न जाएं।",
    safety_tip_road_1: "चलते ट्रैफिक से दूर रहें और फुटपाथ पर सुरक्षित स्थान पर प्रतीक्षा करें।",
    safety_tip_road_2: "आने वाले वाहनों को सचेत करने के लिए संभव हो तो वाहन की हैजर्ड लाइट चालू करें।",
    safety_tip_road_3: "गंभीर रूप से घायल पीड़ितों को तब तक न हिलाएं जब तक कि आग या टक्कर का सीधा खतरा न हो।",
    safety_tip_flood_1: "तुरंत ऊंचे स्थान पर जाएं और बाढ़ के पानी में चलने या गाड़ी चलाने से बचें।",
    safety_tip_flood_2: "गिरे हुए बिजली के खंभों, तारों और क्षतिग्रस्त दीवारों से दूर रहें।",
    safety_tip_flood_3: "बचाव दल की प्रतीक्षा करते हुए टॉर्च, पीने का पानी और चार्ज फोन साथ रखें।",
    safety_tip_rescue_1: "मलबे या अस्थिर संरचनाओं से दूर एक स्थिर और सुरक्षित स्थान पर रहें।",
    safety_tip_rescue_2: "यदि फंसे हों तो आवाज करें या रोशनी से संकेत दें, ऊर्जा बचाने के लिए अनावश्यक चिल्लाने से बचें।",
    safety_tip_rescue_3: "आने वाले बचाव और खोजी दल के लिए प्रवेश मार्ग खुला और खाली रखें।",
    safety_tip_gen_1: "मदद आने तक यदि संभव हो तो अच्छी रोशनी वाले और सुरक्षित स्थान पर रहें।",
    safety_tip_gen_2: "अपनी फोन लाइन खाली रखें ताकि आपातकालीन दल या समन्वयक आपसे संपर्क कर सकें।",
    safety_tip_gen_3: "किसी साथी से कहें कि वह सड़क पर नज़र रखे और वाहन को सही स्थान तक निर्देशित करे।",

    // Call a Doctor
    call_doctor_title: "डॉक्टर को कॉल करें",
    call_doctor_subtitle: "ऑन-कॉल डॉक्टर से संपर्क करें या तुरंत कॉलबैक का अनुरोध करें।",
    call_doctor_btn: "तुरंत डॉक्टर कॉल का अनुरोध करें",
    call_doctor_direct_108: "108 मेडिकल एम्बुलेंस कॉल करें",
    call_doctor_notes_placeholder: "वैकल्पिक: रोगी की स्थिति या लक्षण संक्षेप में लिखें",
    call_doctor_success: "डॉक्टर कॉल अनुरोध दर्ज किया गया। चिकित्सा सलाहकार शीघ्र ही आपसे संपर्क करेंगे।",
    doctor_calling_unavailable: "डॉक्टर कॉलिंग वर्तमान में अनुपलब्ध है। चिकित्सीय आपात स्थिति के लिए, सीधे 112 डायल करें।",

    // Coordinator Persistent Notifications
    admin_notifications_title: "समन्वयक अलर्ट",
    admin_notifications_mark_all: "सभी को पढ़ा हुआ चिह्नित करें",
    admin_notifications_empty: "अभी कोई समन्वयक सूचना नहीं है।",

    // Multi-factor Smart Allocation
    alloc_score_label: "विश्वास स्कोर",
    alloc_auto_dispatch: "स्वचालित प्रेषण के लिए सुरक्षित",
    alloc_admin_review: "समन्वयक समीक्षा आवश्यक",
    alloc_algorithm_badge: "नियम-आधारित बहु-कारक स्कोरिंग इंजन",

    // Progressive Web App (PWA)
    pwa_install_app: "ऐप इंस्टॉल करें",
    pwa_install_careon: "CareOn इंस्टॉल करें",
    pwa_banner_title: "अपने डिवाइस पर CareOn इंस्टॉल करें",
    pwa_banner_desc: "त्वरित 1-टैप आपातकालीन पहुंच के लिए अपनी होम स्क्रीन पर CareOn जोड़ें।",
    pwa_install_btn: "अभी इंस्टॉल करें",
    pwa_dismiss_btn: "अभी नहीं",
    pwa_ios_title: "अपने iPhone पर CareOn इंस्टॉल करें",
    pwa_ios_subtitle: "CareOn को अपनी होम स्क्रीन पर जोड़ने के लिए Safari में इन चरणों का पालन करें:",
    pwa_ios_step1: "1. Safari के नीचे शेयर (Share) बटन पर टैप करें।",
    pwa_ios_step2: "2. नीचे स्क्रॉल करें और 'Add to Home Screen' चुनें।",
    pwa_ios_step3: "3. इंस्टॉल करने के लिए ऊपर दाईं ओर 'Add' पर टैप करें।",
    pwa_instructions_close: "समझ गया",
    pwa_already_installed: "ऐप इंस्टॉल है",
    pwa_android_other_title: "CareOn को होम स्क्रीन पर जोड़ें",
    pwa_android_other_desc: "अपने ब्राउज़र मेनू (⋮) पर टैप करें और 'Install App' या 'Add to Home screen' चुनें।",
  },
  kn: {
    // Brand & Identity
    brand_name: "CareOn",
    brand_tagline: "ಸಹಾಯ ನೀವು ಯೋಚಿಸುವುದಕ್ಕಿಂತ ಹತ್ತಿರದಲ್ಲಿದೆ.",
    brand_subtitle: "ಬುದ್ಧಿವಂತ ತುರ್ತು ಸಂಪನ್ಮೂಲ ಸಂಯೋಜನಾ ವೇದಿಕೆ",
    disclaimer_short: "CareOn ತುರ್ತು ಸಂಪನ್ಮೂಲ ಸಂಯೋಜನಾ ಮಾದರಿಯಾಗಿದೆ. ಜೀವಕ್ಕೆ ಅಪಾಯವಿರುವ ಸಂದರ್ಭದಲ್ಲಿ ಯಾವಾಗಲೂ 112 ಅಥವಾ 108 ಗೆ ಕರೆ ಮಾಡಿ.",
    official_helpline_btn: "ತುರ್ತು ಕರೆ: 112",

    // Navigation
    nav_home: "ಮುಖಪುಟ",
    nav_report: "ತುರ್ತು ವರದಿ ಮಾಡಿ",
    nav_track: "ಕೋರಿಕೆ ಪರಿಶೀಲಿಸಿ",
    nav_user_portal: "ಬಳಕೆದಾರ ಪೋರ್ಟಲ್",
    nav_user_dashboard: "ನನ್ನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    nav_user_history: "ನನ್ನ ಇತಿಹಾಸ",
    nav_user_login: "ಬಳಕೆದಾರ ಲಾಗಿನ್",
    nav_user_register: "ಖಾತೆ ತೆರೆಯಿರಿ",
    nav_admin_portal: "ಕಮಾಂಡ್ ಸೆಂಟರ್",
    nav_admin_login: "ನಿರ್ವಾಹಕ ಲಾಗಿನ್",
    nav_privacy: "ಗೌಪ್ಯತೆ ಮತ್ತು ನಿಯಮಗಳು",
    nav_logout: "ಲಾಗ್‌ಔಟ್",
    nav_notifications: "ಸೂಚನೆಗಳು",
    system_online: "ವ್ಯವಸ್ಥೆ ಸಕ್ರಿಯವಾಗಿದೆ (ಲೈವ್)",
    system_connecting: "ಸಂಪರ್ಕ ಕಲ್ಪಿಸಲಾಗುತ್ತಿದೆ...",
    citizen_portal: "ನಾಗರಿಕ ಪೋರ್ಟಲ್",
    login_link: "ಸೈನ್ ಇನ್",
    notifications_title: "ಸೂಚನೆಗಳು",
    hero_title: "ಪ್ರತಿ ಕ್ಷಣವೂ ಅಮೂಲ್ಯ. ನಿಮ್ಮ ನೆರವಿಗೆ ನಾವಿದ್ದೇವೆ.",
    hero_subtitle: "ತುರ್ತು ಪರಿಸ್ಥಿತಿಯನ್ನು ವರದಿ ಮಾಡಿ, ಸಂಯೋಜಿತ ಸಹಾಯವನ್ನು ಕಂಡುಕೊಳ್ಳಿ ಮತ್ತು ನಿರಂತರ ಅಪ್‌ಡೇಟ್‌ಗಳನ್ನು ಪಡೆಯಿರಿ.",
    hero_report_btn: "ತುರ್ತು ಪರಿಸ್ಥಿತಿ ವರದಿ ಮಾಡಿ",
    hero_track_btn: "ನನ್ನ ಮನವಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    hero_sahara_btn: "ಸಹಾರಾ ಜೊತೆ ಮಾತನಾಡಿ",

    // Hero Section
    hero_headline: "ಪ್ರತಿ ಸೆಕೆಂಡೂ ಮುಖ್ಯ. ನಾವು ಸಹಾಯಕ್ಕೆ ಇಲ್ಲಿದ್ದೇವೆ.",
    hero_subheadline: "ತುರ್ತು ಪರಿಸ್ಥಿತಿಯನ್ನು ವರದಿ ಮಾಡಿ, ಸಂಯೋಜಿತ ಪರಿಣಿತ ಸಹಾಯವನ್ನು ಪಡೆಯಿರಿ ಮತ್ತು ನಿರಂತರ ಅಪ್‌ಡೇಟ್‌ಗಳನ್ನು ಪಡೆಯಿರಿ.",
    btn_report_emergency: "🚨 ತುರ್ತು ವರದಿ ಮಾಡಿ",
    btn_track_my_request: "🔍 ಕೋರಿಕೆ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    btn_talk_to_sahara: "💬 ಸಹಾರಾ ಜೊತೆ ಮಾತನಾಡಿ",
    hero_stat_conflict: "100% ಸಂಘರ್ಷ ರಹಿತ",
    hero_stat_fee: "₹0 ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಶುಲ್ಕ",
    hero_stat_coverage: "ಮೈಸೂರು ಹಾಗೂ ಪ್ರಾದೇಶಿಕ ವ್ಯಾಪ್ತಿ",

    // How CareOn Works
    how_it_works_heading: "CareOn ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
    how_it_works_subheading: "ನಾಗರಿಕರು, ತುರ್ತು ರಕ್ಷಣಾ ತಂಡಗಳು ಮತ್ತು ಪಾಲುದಾರ ಸಂಸ್ಥೆಗಳ ನಡುವಿನ ಸಮನ್ವಯ ಸೇತುವೆ.",
    step1_title: "1. ತುರ್ತು ಮಾಹಿತಿ ನೀಡಿ",
    step1_desc: "ಜಿಪಿಎಸ್ ಸ್ಥಳ ಗುರುತಿಸುವಿಕೆಯೊಂದಿಗೆ 30 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ವರ್ಗ, ಸ್ಥಳ ಮತ್ತು ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.",
    step2_title: "2. CareOn ಪರಿಸ್ಥಿತಿಯನ್ನು ನಿರ್ಣಯಿಸುತ್ತದೆ",
    step2_desc: "ನಿಯಮ ಆಧಾರಿತ ಎಂಜಿನ್ ಆದ್ಯತೆಯನ್ನು ಗುರುತಿಸುತ್ತದೆ ಮತ್ತು ನಕಲು ವರದಿಗಳನ್ನು ಪರಿಶೀಲಿಸುತ್ತದೆ.",
    step3_title: "3. ಸಂಪನ್ಮೂಲಗಳ ಹಂಚಿಕೆ",
    step3_desc: "ಯಾವುದೇ ಸಂಘರ್ಷವಿಲ್ಲದೆ ಪರಿಣಿತ ವಾಹನಗಳನ್ನು ನಿಯೋಜಿಸುತ್ತದೆ ಅಥವಾ ಬಾಹ್ಯ ಪಾಲುದಾರರನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.",
    step4_title: "4. ಸಹಾಯವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    step4_desc: "ಲೈವ್ ವಾಹನ ಚಲನೆ, ತಲುಪುವ ಅಂದಾಜು ಸಮಯ ಮತ್ತು ಪಾರದರ್ಶಕ ದರ ಅನುಮತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.",

    // Feature Cards
    features_heading: "ಸಮಗ್ರ ತುರ್ತು ಸಂಪನ್ಮೂಲ ಸಂಯೋಜನೆ",
    feat_coordination_title: "ಬುದ್ಧಿವಂತ ತುರ್ತು ಸಂಯೋಜನೆ",
    feat_coordination_desc: "ತುರ್ತಿನ ತೀವ್ರತೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ ಸೂಕ್ತ ಪರಿಣಿತ ವಾಹನಗಳನ್ನು (ಆಂಬ್ಯುಲೆನ್ಸ್, ಅಗ್ನಿಶಾಮಕ, ರಕ್ಷಣಾ ದೋಣಿ) ಹೊಂದಿಸುತ್ತದೆ.",
    feat_shortage_title: "ಸಂಪನ್ಮೂಲ ಕೊರತೆ ನಿರ್ವಹಣೆ",
    feat_shortage_desc: "ನಗರದ ವಾಹನಗಳು ಕಾರ್ಯನಿರತವಾಗಿದ್ದಾಗ, ಕೊರತೆಯನ್ನು ಗುರುತಿಸಿ ನೋಂದಾಯಿತ ಖಾಸಗಿ ಸಂಸ್ಥೆಗಳನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.",
    feat_external_title: "ಬಾಹ್ಯ ಪಾಲುದಾರರ ಸಮನ್ವಯ",
    feat_external_desc: "ಪಾಲುದಾರ ಆಸ್ಪತ್ರೆಗಳು, ಖಾಸಗಿ ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗಳು ಮತ್ತು ಎನ್‌ಜಿಒಗಳನ್ನು ಆದ್ಯತೆಯ ಮೇಲೆ ಸಂಯೋಜಿಸುತ್ತದೆ.",
    feat_tracking_title: "ನೈಜ ಸಮಯದ ಟ್ರ್ಯಾಕಿಂಗ್",
    feat_tracking_desc: "ವರದಿ ಸ್ವೀಕೃತಿಯಿಂದ ಪರಿಶೀಲನೆ, ನಿಯೋಜನೆ ಮತ್ತು ಪರಿಹಾರದವರೆಗೆ ಪ್ರತಿ ಹಂತವನ್ನೂ ನೇರವಾಗಿ ಗಮನಿಸಿ.",
    feat_sahara_title: "ಸಹಾರಾ ಕಾಳಜಿಯುಳ್ಳ ಸಹವರ್ತಿ",
    feat_sahara_desc: "ವರದಿ ಮತ್ತು ಟ್ರ್ಯಾಕಿಂಗ್‌ಗೆ ಸಹಾಯ ಮಾಡುವ ಕರುಣಾಮಯಿ ಎಐ ಸಹವರ್ತಿ.",
    feat_transparency_title: "ಪಾರದರ್ಶಕ ಸೇವಾ ಶುಲ್ಕ",
    feat_transparency_desc: "CareOn ಯಾವಾಗಲೂ ₹0 ಶುಲ್ಕ ವಿಧಿಸುತ್ತದೆ. ಖಾಸಗಿ ಸೇವೆಗಳ ದರಕ್ಕೆ ನಿಮ್ಮ ಸ್ಪಷ್ಟ ಅನುಮತಿಯನ್ನು ಮೊದಲೇ ಪಡೆಯಲಾಗುತ್ತದೆ.",

    // Auth & Navigation
    user_login_title: "ನಾಗರಿಕ ಪೋರ್ಟಲ್ ಲಾಗಿನ್",
    user_login_subtitle: "ನಿಮ್ಮ ವರದಿ ಮಾಡಿದ ತುರ್ತು ಪರಿಸ್ಥಿತಿಗಳು, ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ತುರ್ತು ಎಚ್ಚರಿಕೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ.",
    user_register_title: "ನಾಗರಿಕ ಖಾತೆಯನ್ನು ರಚಿಸಿ",
    user_register_subtitle: "ಖಾಸಗಿ ತುರ್ತು ದಾಖಲೆಗಳನ್ನು ನಿರ್ವಹಿಸಲು ಮತ್ತು ಸಮನ್ವಯಗೊಂಡ ಅಪ್‌ಡೇಟ್‌ಗಳನ್ನು ಪಡೆಯಲು ನೋಂದಾಯಿಸಿ.",
    admin_login_title: "ಕಮಾಂಡ್ ಸೆಂಟರ್ ಲಾಗಿನ್",
    admin_login_subtitle: "ತುರ್ತು ಸಂಯೋಜಕರು ಮತ್ತು ನಿರ್ವಾಹಕರಿಗೆ ಮಾತ್ರ ಅಧಿಕೃತ ಪ್ರವೇಶ.",
    admin_login_btn: "ಕಮಾಂಡ್ ಸೆಂಟರ್‌ಗೆ ಪ್ರವೇಶಿಸಿ",
    email_label: "ಇಮೇಲ್ ವಿಳಾಸ",
    email_placeholder: "ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ",
    password_label: "ಪಾಸ್‌ವರ್ಡ್",
    password_placeholder: "ಸುರಕ್ಷಿತ ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ",
    confirm_password_label: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
    confirm_password_placeholder: "ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ದೃಢೀಕರಿಸಿ",
    full_name_label: "ಪೂರ್ಣ ಹೆಸರು",
    full_name_placeholder: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    phone_label: "ಫೋನ್ ಸಂಖ್ಯೆ",
    phone_placeholder: "ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
    sign_in_btn: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
    create_account_btn: "ಖಾತೆ ರಚಿಸಿ",
    demo_account_hint: "ತ್ವರಿತ ಮೌಲ್ಯಮಾಪನ ಡೆಮೊ ವಿವರಗಳು",
    fill_demo_user: "ನಾಗರಿಕ ಡೆಮೊ ವಿವರ ಭರ್ತಿ ಮಾಡಿ",
    fill_demo_admin: "ಸಂಯೋಜಕ ಡೆಮೊ ವಿವರ ಭರ್ತಿ ಮಾಡಿ",
    no_account_prompt: "ಖಾತೆ ಹೊಂದಿಲ್ಲವೇ?",
    register_link: "ಇಲ್ಲಿ ನೋಂದಾಯಿಸಿ",
    already_have_account: "Already have an account?",
    coordinator_access_hint: "ನೀವು ತುರ್ತು ಸಂಯೋಜಕರಾಗಿದ್ದೀರಾ?",
    admin_login_link: "ಸಂಯೋಜಕ ಲಾಗಿನ್",
    looking_for_user_portal: "ನಾಗರಿಕ ಪೋರ್ಟಲ್‌ಗಾಗಿ ಹುಡುಕುತ್ತಿರುವಿರಾ?",
    fill_all_fields: "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.",
    invalid_credentials: "ಅಮಾನ್ಯ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್.",
    admin_unauthorized: "ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ. ನಿರ್ವಾಹಕ ಸವಲತ್ತುಗಳು ಅಗತ್ಯವಿದೆ.",
    login_success: "ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ! ಮರುನಿರ್ದೇಶಿಸಲಾಗುತ್ತಿದೆ...",
    register_success: "ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚನೆಯಾಗಿದೆ! ಮರುನಿರ್ದೇಶಿಸಲಾಗುತ್ತಿದೆ...",
    password_mismatch: "ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    logout_btn: "ಲಾಗ್‌ಔಟ್ ಮಾಡಿ",

    // User Dashboard
    authenticated_citizen_badge: "ದೃಢೀಕರಿಸಿದ ನಾಗರಿಕ ಖಾತೆ",
    welcome_back: "ಸ್ವಾಗತ,",
    refresh_feed: "ಫೀಡ್ ರಿಫ್ರೆಶ್ ಮಾಡಿ",
    refresh: "ರಿಫ್ರೆಶ್ ಮಾಡಿ",
    feed_refreshed: "ಲೈವ್ ಘಟನೆಯ ಮಾಹಿತಿಯೊಂದಿಗೆ ಫೀಡ್ ಯಶಸ್ವಿಯಾಗಿ ರಿಫ್ರೆಶ್ ಆಗಿದೆ.",
    my_requests_title: "ನನ್ನ ತುರ್ತು ಘಟನೆಗಳು",
    btn_report_new: "ಹೊಸ ತುರ್ತು ಪರಿಸ್ಥಿತಿಯನ್ನು ವರದಿ ಮಾಡಿ",
    no_incidents_title: "ಯಾವುದೇ ಸಕ್ರಿಯ ತುರ್ತು ಘಟನೆಗಳಿಲ್ಲ",
    no_incidents_desc: "ನೀವು ಇನ್ನೂ ಯಾವುದೇ ತುರ್ತು ವಿನಂತಿಗಳನ್ನು ಸಲ್ಲಿಸಿಲ್ಲ. ನಿಮಗೆ ವೈದ್ಯಕೀಯ, ಅಗ್ನಿಶಾಮಕ ಅಥವಾ ರಕ್ಷಣಾ ನೆರವು ಅಗತ್ಯವಿದ್ದರೆ, ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ವರದಿ ಮಾಡಿ.",
    track_incident_btn: "ಲೈವ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    recent_notifications: "ನನ್ನ ಅಧಿಸೂಚನೆಗಳು",
    no_notifications: "ಯಾವುದೇ ಹೊಸ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ.",
    helpline_alert_title: "ರಾಷ್ಟ್ರೀಯ ತುರ್ತು ಸಹಾಯವಾಣಿ",
    helpline_alert_desc: "ತಕ್ಷಣದ ಜೀವಕ್ಕೆ ಅಪಾಯವಿರುವ ಸಂದರ್ಭಗಳಲ್ಲಿ, ನೇರವಾಗಿ 112 ಗೆ ಕರೆ ಮಾಡಿ.",
    dial_112_btn: "112 ಗೆ ಕರೆ ಮಾಡಿ",
    feedback: "ಪ್ರತಿಕ್ರಿಯೆ",

    // Home & Features
    how_it_works_title: "CareOn ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
    feature1_title: "ತ್ವರಿತ ತುರ್ತು ರವಾನೆ",
    feature1_desc: "ಹತ್ತಿರದ ನೆಲೆಗಳಿಂದ ಎಎಲ್‌ಎಸ್ ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗಳು, ಟ್ರಾಮಾ ತಂಡಗಳು, ಅಗ್ನಿಶಾಮಕ ವಾಹನಗಳು ಮತ್ತು ರಕ್ಷಣಾ ಪಡೆಗಳನ್ನು ಸಂಯೋಜಿಸುತ್ತದೆ.",
    feature2_title: "ಬ್ಯಾಕಪ್ ನೆರವು ಮತ್ತು ಪಾಲುದಾರ ಜಾಲ",
    feature2_desc: "ಸರ್ಕಾರಿ ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗಳು ಕಾರ್ಯನಿರತವಾಗಿದ್ದರೆ, ತಕ್ಷಣವೇ ಪರಿಶೀಲಿಸಿದ ಖಾಸಗಿ ಆಸ್ಪತ್ರೆಗಳು ಮತ್ತು ಸಹಾಯಕರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುತ್ತದೆ.",
    feature3_title: "ಏಕಕಾಲೀನ ನಿಖರ ನಿಯೋಜನೆ",
    feature3_desc: "ನೈಜ-ಸಮಯದ ಲಾಕ್ ಪರಿಶೀಲನೆಯೊಂದಿಗೆ ಏಕಕಾಲೀನ ತುರ್ತು ಸಂದರ್ಭಗಳಲ್ಲಿ ಯಾವುದೇ ವಾಹನವನ್ನು ಎರಡು ಬಾರಿ ನಿಯೋಜಿಸದಂತೆ ತಡೆಯುತ್ತದೆ.",
    feature4_title: "ಸ್ಮಾರ್ಟ್ ಸಂಪನ್ಮೂಲ ಯೋಜನೆ",
    feature4_desc: "ಜನಸಂಖ್ಯೆಯ ಸಾಂದ್ರತೆ ಮತ್ತು ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳ ಆಧಾರದ ಮೇಲೆ ಸಂಪನ್ಮೂಲ ಬೇಡಿಕೆಯನ್ನು ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತದೆ.",
    feature5_title: "ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತ ಮತ್ತು ಖಾಸಗಿ ನೆರವು",
    feature5_desc: "ಸ್ಪ್ಯಾಮ್ ತಡೆಗಟ್ಟಲು ಒಟಿಪಿ ದೃಢೀಕರಣದೊಂದಿಗೆ ನಾಗರಿಕರ ಆರೋಗ್ಯ ದಾಖಲೆಗಳು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಗೌಪ್ಯವಾಗಿರುತ್ತವೆ.",
    feature6_title: "ಸಹಾರಾ 24/7 AI ಸಹಾಯಕ",
    feature6_desc: "ದಿನದ 24 ಗಂಟೆಯೂ ಲಭ್ಯವಿರುವ ಕಾಳಜಿಯುಕ್ತ, ಬಹುಭಾಷಾ ತುರ್ತು ನೆರವು ಸಹಾಯಕ.",
    zero_commission_title: "₹0 ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಶುಲ್ಕ — ಪಾರದರ್ಶಕ ತುರ್ತು ಸಮನ್ವಯ",
    zero_commission_desc: "CareOn ₹0 ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಶುಲ್ಕವನ್ನು ವಿಧಿಸುತ್ತದೆ. ಖಾಸಗಿ ಸೇವಾ ಪೂರೈಕೆದಾರರು ಶುಲ್ಕ ವಿಧಿಸಿದರೆ, ಸಂಯೋಜಕರು ನಾಗರಿಕರ ಸ್ಪಷ್ಟ ಒಪ್ಪಿಗೆಗಾಗಿ ದರಪಟ್ಟಿಯನ್ನು ಪ್ರಸ್ತುತಪಡಿಸುತ್ತಾರೆ.",

    // User Portal & Auth
    login_title_user: "ನಾಗರಿಕ ಪೋರ್ಟಲ್ ಲಾಗಿನ್",
    login_subtitle_user: "ನಿಮ್ಮ ತುರ್ತು ವರದಿಗಳು, ಸ್ಥಿತಿ ಮತ್ತು ವೈಯಕ್ತಿಕ ಸೂಚನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ.",
    login_title_admin: "ಕಮಾಂಡ್ ಸೆಂಟರ್ ನಿರ್ವಾಹಕ ಲಾಗಿನ್",
    login_subtitle_admin: "ತುರ್ತು ಸಂಯೋಜಕರು ಮತ್ತು ಅಧಿಕೃತ ಅಧಿಕಾರಿಗಳಿಗೆ ಮಾತ್ರ ಪ್ರವೇಶ.",
    register_title: "ನಾಗರಿಕ ಖಾತೆ ರಚಿಸಿ",
    register_subtitle: "ವೈಯಕ್ತಿಕ ತುರ್ತು ದಾಖಲೆಗಳನ್ನು ನಿರ್ವಹಿಸಲು ಮತ್ತು ಅಪ್‌ಡೇಟ್ ಪಡೆಯಲು ನೋಂದಾಯಿಸಿ.",
    form_fullname: "ಪೂರ್ಣ ಹೆಸರು",
    form_email: "ಇಮೇಲ್ ವಿಳಾಸ",
    form_phone: "ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
    form_password: "ಪಾಸ್‌ವರ್ಡ್",
    form_confirm_password: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
    form_remember_me: "ಲಾಗಿನ್ ನೆನಪಿಡಿ",
    btn_sign_in: "ಸೈನ್ ಇನ್",
    btn_register: "ಖಾತೆ ರಚಿಸಿ",
    already_have_account: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? ಲಾಗಿನ್ ಆಗಿ",
    need_account: "ಖಾತೆ ಇಲ್ಲವೇ? ಇಲ್ಲಿ ನೋಂದಾಯಿಸಿ",
    admin_access_only: "ಕಮಾಂಡ್ ಸೆಂಟರ್ ಅಧಿಕೃತ ನಿರ್ವಾಹಕರಿಗೆ ಮಾತ್ರ ಸೀಮಿತವಾಗಿದೆ.",

    // User Dashboard
    user_dashboard_title: "ನಾಗರಿಕ ತುರ್ತು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    user_welcome: "ಸುಸ್ವಾಗತ",
    user_active_requests: "ಸಕ್ರಿಯ ತುರ್ತು ಕೋರಿಕೆಗಳು",
    user_no_active: "ಪ್ರಸ್ತುತ ನಿಮ್ಮ ಯಾವುದೇ ಸಕ್ರಿಯ ತುರ್ತು ಕೋರಿಕೆಗಳಿಲ್ಲ.",
    user_quick_actions: "ತ್ವರಿತ ತುರ್ತು ಕ್ರಮಗಳು",
    user_history_title: "ನನ್ನ ತುರ್ತು ವರದಿಗಳ ಇತಿಹಾಸ",
    user_profile_card: "ವರದಿದಾರರ ಪ್ರೊಫೈಲ್",
    user_trust_status: "ದೃಢೀಕರಣ ಸ್ಥಿತಿ",

    // Emergency Reporting Form
    report_title: "ತುರ್ತು ಸಹಾಯ ಕೋರಿಕೆ",
    report_subtitle: "ಸರಿಯಾದ ವಾಹನ ರವಾನಿಸಲು ದಯವಿಟ್ಟು ನಿಖರವಾದ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.",
    cat_select_label: "1. ತುರ್ತು ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ *",
    desc_label: "2. ಏನಾಯಿತು? (ಸಂಕ್ಷಿಪ್ತ ವಿವರ) *",
    desc_placeholder: "ಪರಿಸ್ಥಿತಿಯನ್ನು ವಿವರಿಸಿ (ಉದಾ., ಜಂಕ್ಷನ್ ಬಳಿ ದ್ವಿಚಕ್ರ ವಾಹನ ಅಪಘಾತ, ಸವಾರ ಪ್ರಜ್ಞಾಹೀನ ಸ್ಥಿತಿಯಲ್ಲಿದ್ದಾರೆ)...",
    loc_label: "3. ಮೈಸೂರಿನಲ್ಲಿ ಸ್ಥಳ / ಹೆಗ್ಗುರುತು *",
    loc_placeholder: "ಉದಾ., ಕೆ.ಆರ್. ಆಸ್ಪತ್ರೆ ಗೇಟ್ 2 ಬಳಿ, ಸಯ್ಯಾಜಿ ರಾವ್ ರಸ್ತೆ, ಮೈಸೂರು",
    btn_use_gps: "📍 ನನ್ನ ಜಿಪಿಎಸ್ ಸ್ಥಳ ಬಳಸಿ",
    loc_detecting: "ಜಿಪಿಎಸ್ ಸ್ಥಳ ಗುರುತಿಸಲಾಗುತ್ತಿದೆ...",
    affected_label: "ತೊಂದರೆಗೊಳಗಾದ ಜನರ ಸಂಖ್ಯೆ *",
    help_label: "ಅಗತ್ಯವಿರುವ ಸಹಾಯದ ಪ್ರಕಾರ",
    help_placeholder: "ಉದಾ., ಆಕ್ಸಿಜನ್ ಆಂಬ್ಯುಲೆನ್ಸ್, ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ, ಅಗ್ನಿಶಾಮಕ",
    contact_name_label: "ಸಂಪರ್ಕ ವ್ಯಕ್ತಿಯ ಹೆಸರು *",
    contact_phone_label: "ಸಂಪರ್ಕ ದೂರವಾಣಿ ಸಂಖ್ಯೆ *",
    disaster_details_label: "ಅಗತ್ಯವಿರುವ ವಿಪತ್ತು ಪರಿಹಾರ ಸಾಮಗ್ರಿಗಳು",
    disaster_details_placeholder: "ಉದಾ., ಕುಡಿಯುವ ನೀರು (500L), ರಕ್ಷಣಾ ದೋಣಿಗಳು, ಆಹಾರ ಪೊಟ್ಟಣಗಳು",
    demo_otp_notice: "ತುರ್ತು ಪರಿಶೀಲನೆ: ನಿಮ್ಮ ಸಂಪರ್ಕ ಸಂಖ್ಯೆಗಾಗಿ ರಚಿಸಲಾದ ಇನ್-ಆ್ಯಪ್ ಪರಿಶೀಲನಾ ಕೋಡ್ ಅನ್ನು ನಮೂದಿಸಿ.",
    emergency_notice: "ಸಹಾಯ ಕೋರುವ ಮುನ್ನ: ಸರಿಯಾದ ಮಾಹಿತಿಯನ್ನು ನೀಡಿ ಇದರಿಂದ ನಾವು ಸೂಕ್ತ ಸಹಾಯವನ್ನು ತಲುಪಿಸಬಹುದು. ಶುಲ್ಕವಿರುವ ಬಾಹ್ಯ ಸೇವೆಗಳಿಗೆ ನಿಮ್ಮ ಅನುಮತಿಯನ್ನು ಮೊದಲೇ ಪಡೆಯಲಾಗುತ್ತದೆ. ನಿಮ್ಮ ಸುರಕ್ಷತೆಯೇ ನಮ್ಮ ಆದ್ಯತೆ. ❤️",
    btn_submit_report: "🚨 ತುರ್ತು ಮಾಹಿತಿ ಸಲ್ಲಿಸಿ",
    submitting_report: "ವರ್ಗೀಕರಣ ಮತ್ತು ಸಲ್ಲಿಕೆ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...",

    // Categories
    cat_medical: "ವೈದ್ಯಕೀಯ ತುರ್ತುಸ್ಥಿತಿ",
    cat_medical_desc: "ಹೃದಯಾಘಾತ, ಉಸಿರಾಟದ ತೊಂದರೆ, ತೀವ್ರ ರಕ್ತಸ್ರಾವ, ಪ್ರಜ್ಞಾಹೀನತೆ",
    cat_road_accident: "ರಸ್ತೆ ಅಪಘಾತ",
    cat_road_accident_desc: "ವಾಹನಗಳ ಮುಖಾಮುಖಿ ಡಿಕ್ಕಿ, ರಸ್ತೆಯಲ್ಲಿ ಗಾಯಗೊಂಡವರು",
    cat_fire: "ಅಗ್ನಿ ಅವಘಡ",
    cat_fire_desc: "ಕಟ್ಟಡದಲ್ಲಿ ಬೆಂಕಿ, ಹೊಗೆ, ಅನಿಲ ಸೋರಿಕೆ",
    cat_rescue: "ರಕ್ಷಣಾ ಕಾರ್ಯಾಚರಣೆ",
    cat_rescue_desc: "ಕುಸಿದ ಕಟ್ಟಡ, ನೀರಿನಲ್ಲಿ ಸಿಲುಕಿದವರು, ತುರ್ತು ರಕ್ಷಣೆ",
    cat_disaster: "ವಿಪತ್ತು / ಪ್ರವಾಹ",
    cat_disaster_desc: "ನಗರ ಪ್ರವಾಹ, ನೀರು ತುಂಬಿದ ಮನೆಗಳು, ನೆರೆ ಸಂತ್ರಸ್ತರು",
    cat_safety: "ಸುರಕ್ಷತೆ / ಇತರೆ",
    cat_safety_desc: "ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತೆ ತೊಂದರೆ, ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ",

    // Incident Tracking
    track_title: "ತುರ್ತು ಕೋರಿಕೆ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    track_search_placeholder: "ಇನ್ಸಿಡೆಂಟ್ ಕೋಡ್ ನಮೂದಿಸಿ (ಉದಾ. CARE-2026-101)",
    btn_search_track: "ಸ್ಥಿತಿ ಹುಡುಕಿ",
    track_status_label: "ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ",
    track_reported_at: "ವರದಿಯಾದ ಸಮಯ",
    track_priority_label: "ಆದ್ಯತೆ",
    track_assigned_unit: "ನಿಯೋಜಿತ ತುರ್ತು ರಕ್ಷಣಾ ತಂಡ",
    track_eta_label: "ತಲುಪುವ ಅಂದಾಜು ಸಮಯ",
    track_cost_breakdown_title: "ವೆಚ್ಚ ಪಾರದರ್ಶಕತೆ ಮತ್ತು ಬಾಹ್ಯ ಸೇವಾ ವಿವರ",
    platform_fee_label: "CareOn ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಶುಲ್ಕ",
    platform_fee_val: "₹0.00 (ಯಾವಾಗಲೂ ಉಚಿತ)",
    provider_quote_label: "ಬಾಹ್ಯ ಪೂರೈಕೆದಾರರ ದರ ಅಂದಾಜು",
    subsidy_label: "ಸಹಾಯಧನ / ಎನ್‌ಜಿಒ ಪ್ರಾಯೋಜಕತ್ವ",
    net_payable_label: "ಪಾವತಿಸಬೇಕಾದ ಮೊತ್ತ",
    consent_pending_alert: "ದಯವಿಟ್ಟು ದರವನ್ನು ಪರಿಶೀಲಿಸಿ ಸೇವೆ ರವಾನೆಗೆ ಒಪ್ಪಿಗೆ ನೀಡಿ.",
    btn_accept_quote: "✓ ದರ ಒಪ್ಪಿಕೊಳ್ಳಿ ಮತ್ತು ತಂಡ ರವಾನಿಸಿ",
    btn_decline_quote: "✕ ನಿರಾಕರಿಸಿ (ಉಚಿತ ಪರ್ಯಾಯ ಹುಡುಕಿ)",
    consent_approved_badge: "✓ ವರದಿದಾರರಿಂದ ಒಪ್ಪಿಗೆ ನೀಡಲಾಗಿದೆ",
    btn_contact_coordinator: "📞 ಸಂಯೋಜಕರನ್ನು ಸಂಪರ್ಕಿಸಿ (+91 821 244 5566)",
    btn_cancel_request: "✕ ಕೋರಿಕೆ ರದ್ದುಮಾಡಿ",
    cancel_modal_title: "ತುರ್ತು ಕೋರಿಕೆ ರದ್ದುಗೊಳಿಸಿ",
    cancel_modal_desc: "ನಿಯೋಜಿತ ವಾಹನಗಳನ್ನು ಇತರ ತುರ್ತು ಕರೆಗಳಿಗೆ ಬಿಡುಗಡೆ ಮಾಡಲು ದಯವಿಟ್ಟು ಕಾರಣ ತಿಳಿಸಿ.",
    cancel_reason_label: "ರದ್ದು ಮಾಡಲು ಕಾರಣ *",
    cancel_reason_resolved: "ತುರ್ತು ಪರಿಸ್ಥಿತಿ ಬಗೆಹರಿದಿದೆ",
    cancel_reason_independent: "ಸ್ವತಂತ್ರವಾಗಿ ಸಹಾಯ ಪಡೆಯಲಾಗಿದೆ",
    cancel_reason_mistake: "ತಪ್ಪಾಗಿ ವರದಿ ಸಲ್ಲಿಸಲಾಗಿತ್ತು",
    cancel_reason_other: "ಇತರೆ",
    cancel_details_label: "ಹೆಚ್ಚುವರಿ ವಿವರಗಳು (ಐಚ್ಛಿಕ)",
    btn_confirm_cancel: "ರದ್ದತಿಯನ್ನು ದೃಢೀಕರಿಸಿ",
    btn_keep_active: "ಕೋರಿಕೆಯನ್ನು ಮುಂದುವರಿಸಿ",
    cancelling_text: "ರದ್ದುಗೊಳಿಸಲಾಗುತ್ತಿದೆ...",

    // Statuses
    status_received: "ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
    status_verification_pending: "ದೃಢೀಕರಣ ಬಾಕಿ ಇದೆ",
    status_verified: "ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    status_assistance_search: "ಸಹಾಯ ಹುಡುಕಲಾಗುತ್ತಿದೆ",
    status_provider_contacted: "ಸೇವಾ ಪೂರೈಕೆದಾರರನ್ನು ಸಂಪರ್ಕಿಸಲಾಗಿದೆ",
    status_awaiting_provider: "ಪೂರೈಕೆದಾರರ ಪ್ರತಿಕ್ರಿಯೆಗೆ ಕಾಯಲಾಗುತ್ತಿದೆ",
    status_awaiting_consent: "ಬಳಕೆದಾರರ ಒಪ್ಪಿಗೆ ಬಾಕಿ ಇದೆ",
    status_assignment_confirmed: "ನಿಯೋಜನೆ ದೃಢಪಟ್ಟಿದೆ",
    status_team_dispatched: "ತಂಡ ರವಾನೆಯಾಗಿದೆ (ಡಿಸ್ಪ್ಯಾಚ್)",
    status_team_arrived: "ತಂಡ ಸ್ಥಳಕ್ಕೆ ತಲುಪಿದೆ",
    status_resolved: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    status_cancelled: "ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ",
    status_rejected: "ತಿರಸ್ಕರಿಸಲಾಗಿದೆ",

    // Feedback
    feedback_title: "ತುರ್ತು ಮುಕ್ತಾಯವಾಗಿದೆ — ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ ಹಂಚಿಕೊಳ್ಳಿ",
    feedback_subtitle: "ನಿಮ್ಮ ಅನುಭವ ಹಂಚಿಕೊಂಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ❤️ ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ CareOn ಅನ್ನು ಇನ್ನಷ್ಟು ಉತ್ತಮಗೊಳಿಸುತ್ತದೆ.",
    feedback_rating_label: "ಸೇವೆಯನ್ನು ರೇಟ್ ಮಾಡಿ (1 - 5 ನಕ್ಷತ್ರಗಳು)",
    feedback_tags_label: "ಅಭಿಪ್ರಾಯದ ಟ್ಯಾಗ್‌ಗಳು",
    tag_easy_to_use: "ಬಳಸಲು ಸುಲಭ",
    tag_clear_updates: "ಸ್ಪಷ್ಟ ಮಾಹಿತಿ",
    tag_helpful_coordination: "ಉಪಯುಕ್ತ ಸಂಯೋಜನೆ",
    tag_slow_response: "ನಿಧಾನ ಪ್ರತಿಕ್ರಿಯೆ",
    tag_other: "ಇತರೆ",
    feedback_comments_label: "ಲಿಖಿತ ಪ್ರತಿಕ್ರಿಯೆ (ಐಚ್ಛಿಕ)",
    btn_submit_feedback: "ಅಭಿಪ್ರಾಯ ಸಲ್ಲಿಸಿ",
    feedback_received: "ಅಭಿಪ್ರಾಯ ಸ್ವೀಕರಿಸಲಾಗಿದೆ — ಧನ್ಯವಾದಗಳು!",

    // Admin Command Centre
    admin_title: "ತುರ್ತು ಕಾರ್ಯಾಚರಣೆಗಳ ಕಮಾಂಡ್ ಸೆಂಟರ್",
    admin_subtitle: "ಮೈಸೂರು ಪ್ರದೇಶದಲ್ಲಿ ನೈಜ ಸಮಯದ ತುರ್ತು ನಿರ್ವಹಣೆ, ಕೊರತೆ ಎಚ್ಚರಿಕೆ ಮತ್ತು ಪಾಲುದಾರರ ಸಮನ್ವಯ.",
    btn_refresh_feed: "🔄 ಫೀಡ್ ರಿಫ್ರೆಶ್ ಮಾಡಿ",
    refreshing_feed: "ಲೈವ್ ಡೇಟಾ ರಿಫ್ರೆಶ್ ಆಗುತ್ತಿದೆ...",
    feed_refreshed_toast: "ಲೈವ್ ಫೀಡ್ ಬ್ಯಾಕೆಂಡ್ ಜೊತೆ ಸಿಂಕ್ ಆಗಿದೆ.",
    admin_stat_active: "ಸಕ್ರಿಯ ಘಟನೆಗಳು",
    admin_stat_critical: "ತೀವ್ರ ಆದ್ಯತೆ",
    admin_stat_fleet_avail: "ಲಭ್ಯವಿರುವ ವಾಹನಗಳು",
    admin_stat_shortages: "ಸಕ್ರಿಯ ಕೊರತೆಗಳು",
    admin_stat_registered_partners: "ನೋಂದಾಯಿತ ಪಾಲುದಾರರು",
    admin_stat_resolved: "ಪರಿಹರಿಸಲಾದ ಘಟನೆಗಳು",

    // Admin Sidebar Tabs
    tab_overview: "📊 ಅವಲೋಕನ",
    tab_incidents: "🚨 ಘಟನೆಗಳ ಪಟ್ಟಿ",
    tab_resources: "🚑 ಲಭ್ಯ ವಾಹನಗಳು",
    tab_allocations: "🧠 ಬುದ್ಧಿವಂತ ನಿಯೋಜನೆ",
    tab_shortages: "⚠️ ಕೊರತೆ ಎಚ್ಚರಿಕೆ",
    tab_providers: "🏥 ಬಾಹ್ಯ ಪಾಲುದಾರರು",
    tab_map: "🗺️ ಮೈಸೂರು ಲೈವ್ ಮ್ಯಾಪ್",
    tab_simulation: "🎯 ಕೊರತೆ ಸವಾಲು (ಡೆಮೊ)",
    tab_verification: "🔍 ವಿಶ್ವಾಸಾರ್ಹತೆ ಮತ್ತು ಪರಿಶೀಲನೆ",
    tab_disaster: "🌊 ವಿಪತ್ತು ಪರಿಹಾರ",
    tab_analytics: "📈 ಅಂಕಿಅಂಶ & ಎಂಎಲ್",

    // Admin Table Headers
    th_code: "ಇನ್ಸಿಡೆಂಟ್ ಕೋಡ್",
    th_category: "ವಿಭಾಗ",
    th_location: "ಸ್ಥಳ (ಮೈಸೂರು)",
    th_reporter: "ವರದಿದಾರರ ವಿವರ",
    th_priority: "ಆದ್ಯತೆ",
    th_status: "ಸ್ಥಿತಿ",
    th_verification: "ದೃಢೀಕರಣ",
    th_actions: "ಕ್ರಮಗಳು",
    btn_inspect: "ವಿಕ್ಷಿಸಿ",
    btn_verify_otp: "ಓಟಿಪಿ ದೃಢೀಕರಿಸಿ",
    btn_resolve: "ಪರಿಹರಿಸಿ",
    btn_release_fleet: "ವಾಹನ ಬಿಡುಗಡೆ",
    btn_allocate: "ವಾಹನ ನಿಯೋಜಿಸಿ",

    // Sahara
    sahara_name: "ಸಹಾರಾ",
    sahara_role: "ನಿಮ್ಮ ಕಾಳಜಿಯುಳ್ಳ ತುರ್ತು ಬೆಂಬಲ ಸಹವರ್ತಿ",
    sahara_greeting: "ನಮಸ್ಕಾರ! ❤️ ನಾನು ಸಹಾರಾ, ನಿಮ್ಮ ಕಾಳಜಿಯುಳ್ಳ ತುರ್ತು ಬೆಂಬಲ ಸಹವರ್ತಿ. ಗಾಬರಿಯಾಗಬೇಡಿ, ನಾವು ಒಟ್ಟಿಗೆ ಮುಂದಿನ ಹೆಜ್ಜೆಯನ್ನು ನಿರ್ಧರಿಸೋಣ. ಏನಾಯಿತು?",
    sahara_disclaimer: "ಸಹಾರಾ ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯ ನೀಡಲು ಸಾಧ್ಯವಿಲ್ಲ. ಜೀವಕ್ಕೆ ಅಪಾಯವಿದ್ದರೆ ತಕ್ಷಣ 112 ಕರೆ ಮಾಡಿ.",
    sahara_placeholder: "ಸಹಾರಾಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ ಅಥವಾ ಇನ್ಸಿಡೆಂಟ್ ಕೋಡ್ ನಮೂದಿಸಿ...",

    // Notifications
    notif_title: "ಸೂಚನೆಗಳ ಕೇಂದ್ರ",
    notif_empty: "ಯಾವುದೇ ಹೊಸ ಸೂಚನೆಗಳಿಲ್ಲ. ನೈಜ ಸಮಯದ ಅಪ್‌ಡೇಟ್‌ಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.",
    notif_mark_read: "ಓದಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ",
// Additional Global / Header / Navigation
    nav_admin: "ಕಮಾಂಡ್ ಸೆಂಟರ್",
    command_centre_title: "ಕಮಾಂಡ್ ಸೆಂಟರ್",
    command_centre_subtitle: "ಮೈಸೂರಿನಾದ್ಯಂತ ನೈಜ-ಸಮಯದ ತುರ್ತು ಘಟನೆ ವರ್ಗೀಕರಣ, ವಾಹನ ಹೊಂದಾಣಿಕೆ, ಕೊರತೆಯ ಎಚ್ಚರಿಕೆ ಮತ್ತು ಪಾಲುದಾರರ ಸಮನ್ವಯ.",
    admin_role: "ಸಮನ್ವಯಕಾರ",
    refreshing: "ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ...",
    reset_demo_state: "ಸಿಮ್ಯುಲೇಶನ್ ಮರುಹೊಂದಿಸಿ",
    built_with_care: "ತುರ್ತು ನಿರ್ಧಾರ-ಬೆಂಬಲಕ್ಕಾಗಿ ಕಾಳಜಿಯಿಂದ ನಿರ್ಮಿಸಲಾಗಿದೆ.",
    quick_links: "ಪೋರ್ಟಲ್‌ಗಳು & ಸೇವೆಗಳು",
    command_support_title: "ಸಮನ್ವಯಕಾರರ ಬೆಂಬಲ",
    disclaimer_title: "ತುರ್ತು ಸೂಚನೆ",
    footer_disclaimer: "CareOn ಒಂದು ಬುದ್ಧಿವಂತ ತುರ್ತು ಸಂಪನ್ಮೂಲ ಸಮನ್ವಯ ನಿರ್ಧಾರ-ಬೆಂಬಲ ಮಾದರಿಯಾಗಿದೆ. ಇದು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ತುರ್ತು ಸೇವೆಗಳ ಬದಲಿಯಲ್ಲ. ತಕ್ಷಣದ ಜೀವಕ್ಕೆ ಅಪಾಯಕಾರಿ ಸಂದರ್ಭಗಳಲ್ಲಿ ಯಾವಾಗಲೂ ನೇರವಾಗಿ 112 ಗೆ ಕರೆ ಮಾಡಿ.",
    
    // Admin Metric Cards
    stat_active_incidents: "ಸಕ್ರಿಯ ಘಟನೆಗಳು",
    stat_critical_priority: "ತೀವ್ರ ಆದ್ಯತೆ",
    stat_fleet_available: "ಲಭ್ಯ ವಾಹನಗಳು",
    stat_active_shortages: "ಸಕ್ರಿಯ ಕೊರತೆಗಳು",

    // Home / Hero / Workflow / Features
    hero_badge: "ಬುದ್ಧಿವಂತ ಸಂಪನ್ಮೂಲ ಸಮನ್ವಯ",
    workflow_subtitle: "ಸುಗಮ ತುರ್ತು ಸಮನ್ವಯ ಪ್ರಕ್ರಿಯೆ",
    how_it_works_desc: "ಸಂಕಷ್ಟದಲ್ಲಿರುವ ನಾಗರಿಕರು, ರವಾನೆ ಸಂಯೋಜಕರು ಮತ್ತು ತುರ್ತು ಪ್ರತಿಕ್ರಿಯಾ ತಂಡಗಳ ನಡುವಿನ ಸ್ವಯಂಚಾಲಿತ ಸಂಪರ್ಕ ಕೊಂಡಿ.",
    platform_capabilities_badge: "ಸ್ಥಿರತೆ ಮತ್ತು ದಕ್ಷತೆಗಾಗಿ ರೂಪಿಸಲಾಗಿದೆ",
    features_section_title: "ಸಮಗ್ರ ತುರ್ತು ಸಂಪನ್ಮೂಲ ಸಮನ್ವಯ",
    features_section_desc: "ಸಂಪನ್ಮೂಲಗಳ ಕೊರತೆಯನ್ನು ತಡೆಗಟ್ಟಲು, ಹಂಚಿಕೆ ಸಂಘರ್ಷಗಳನ್ನು ತಪ್ಪಿಸಲು ಮತ್ತು ಕ್ಷಿಪ್ರ ನೆರವು ನೀಡಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.",
    
    // Report Emergency Page
    report_emergency_title: "ತುರ್ತು ಪರಿಸ್ಥಿತಿಯನ್ನು ವರದಿ ಮಾಡಿ",
    report_emergency_desc: "ಪ್ರಮುಖ ಘಟನೆ ವಿವರಗಳನ್ನು ನೀಡಿ. CareOn ಹತ್ತಿರದ ಸೂಕ್ತ ವೈದ್ಯಕೀಯ, ಅಗ್ನಿಶಾಮಕ ಅಥವಾ ರಕ್ಷಣಾ ಪಡೆಯನ್ನು ನಿಯೋಜಿಸುತ್ತದೆ.",
    emergency_category_label: "ತುರ್ತು ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    what_happened_label: "ಏನಾಯಿತು? (ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ)",
    location_label: "ಮೈಸೂರಿನಲ್ಲಿ ಸ್ಥಳ / ಹೆಗ್ಗುರುತು",
    location_placeholder: "ಉದಾ. ಕೆಆರ್ ಆಸ್ಪತ್ರೆ ಹತ್ತಿರ, ಸಯ್ಯಾಜಿ ರಾವ್ ರಸ್ತೆ, ಮೈಸೂರು",
    use_my_location: "ನನ್ನ ಜಿಪಿಎಸ್ ಸ್ಥಳ ಬಳಸಿ",
    locating: "ಜಿಪಿಎಸ್ ಗುರುತಿಸಲಾಗುತ್ತಿದೆ...",
    affected_people_label: "ಬಾಧಿತ ವ್ಯಕ್ತಿಗಳು",
    help_required_label: "ಅಗತ್ಯವಿರುವ ಸಹಾಯದ ಪ್ರಕಾರ",
    disaster_supplies_label: "ಸಾಮೂಹಿಕ ವಿಪತ್ತು ಪರಿಹಾರ ಸಾಮಗ್ರಿಗಳು",
    disaster_placeholder: "ಉದಾ. ಕುಡಿಯುವ ನೀರು, ರಕ್ಷಣಾ ದೋಣಿಗಳು, ತುರ್ತು ಆಶ್ರಯ",
    contact_name_label: "ನಿಮ್ಮ / ಸಂಪರ್ಕ ವ್ಯಕ್ತಿಯ ಹೆಸರು",
    contact_phone_label: "ಸಂಪರ್ಕ ಫೋನ್ ಸಂಖ್ಯೆ",
    submit_emergency_btn: "ತುರ್ತು ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಿ",
    submitting: "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...",
    demo_otp_title: "ತುರ್ತು ಸಂಪರ್ಕ ಪರಿಶೀಲನೆ",
    demo_otp_desc: "ಸಲ್ಲಿಕೆಯ ನಂತರ ನಿಮ್ಮ ಸಂಪರ್ಕ ಸಂಖ್ಯೆಗೆ ತುರ್ತು ಪರಿಶೀಲನಾ ಕೋಡ್ ರಚಿಸಲಾಗುತ್ತದೆ.",
    pre_authorized: "ಡೆಮೊ ಅನುಮೋದಿತ",
    report_failed: "ತುರ್ತು ವರದಿ ಸಲ್ಲಿಸಲು ವಿಫಲವಾಗಿದೆ.",
    err_desc_required: "ದಯವಿಟ್ಟು ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆಯನ್ನು ನೀಡಿ (ಕನಿಷ್ಠ 5 ಅಕ್ಷರಗಳು).",
    err_loc_required: "ದಯವಿಟ್ಟು ಸ್ಥಳ ಅಥವಾ ಹೆಗ್ಗುರುತನ್ನು ನಮೂದಿಸಿ.",
    err_contact_required: "ಸಂಪರ್ಕ ವ್ಯಕ್ತಿಯ ಹೆಸರು ಮತ್ತು ಫೋನ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ.",
    invalid_phone: "ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ (ಕನಿಷ್ಠ 8 ಅಂಕಿಗಳು).",
    geo_not_supported: "ನಿಮ್ಮ ಬ್ರೌಸರ್ ಜಿಯೋಲೋಕೇಶನ್ ಬೆಂಬಲಿಸುವುದಿಲ್ಲ.",

    // Incident Category Descriptions
    cat_desc_medical: "ಹೃದಯಾಘಾತ, ಉಸಿರಾಟದ ತೊಂದರೆ, ತೀವ್ರ ಗಾಯ, ಆಘಾತ",
    cat_desc_road: "ವಾಹನಗಳ ಡಿಕ್ಕಿ, ಸಿಲುಕಿರುವ ಪ್ರಯಾಣಿಕರು, ರಸ್ತೆ ಅಪಘಾತ",
    cat_desc_fire: "ಕಟ್ಟಡದ ಬೆಂಕಿ, ಹೊಗೆ, ಗ್ಯಾಸ್ ಸಿಲಿಂಡರ್ ಸೋರಿಕೆ",
    cat_desc_rescue: "ಕಟ್ಟಡ ಕುಸಿತ, ಮುಳುಗುವಿಕೆ, ಸಿಲುಕಿಕೊಂಡ ಸಂತ್ರಸ್ತರು",
    cat_desc_disaster: "ಭಾರಿ ಪ್ರವಾಹ, ಬಿರುಗಾಳಿ, ಸಾಮೂಹಿಕ ಅನಾಹುತ ಘಟನೆ",
    cat_desc_safety: "ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತಾ ಬಿಕ್ಕಟ್ಟು, ಜನಸಂದಣಿ ಅಪಾಯ, ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ",

    // Track Request Page
    track_request_title: "ತುರ್ತು ವಿನಂತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    track_input_placeholder: "ಇನ್ಸಿಡೆಂಟ್ ಕೋಡ್ ನಮೂದಿಸಿ (ಉದಾ. CARE-2026-101)",
    track_request_btn: "ವಿನಂತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    incident_not_found: "ಘಟನೆ ಕಂಡುಬಂದಿಲ್ಲ",
    incident_privacy_restricted: "ಈ ಘಟನೆಯ ದಾಖಲೆಯು ಖಾಸಗಿಯಾಗಿದ್ದು ಇನ್ನೊಬ್ಬ ಬಳಕೆದಾರರಿಗೆ ಸೇರಿದೆ.",
    assigned_unit_title: "ನಿಯೋಜಿತ ತುರ್ತು ಪ್ರತಿಕ್ರಿಯಾ ವಾಹನ",
    eta: "ಅಂದಾಜು ಆಗಮನ ಸಮಯ",
    timeline_title: "ಲೈವ್ ಚಟುವಟಿಕೆ ಮತ್ತು ಆಡಿಟ್ ಟೈಮ್‌ಲೈನ್",
    awaiting_updates: "ಆರಂಭಿಕ ಸಮನ್ವಯಕಾರರ ಅಪ್‌ಡೇಟ್‌ಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ...",
    cost_transparency_title: "ವೆಚ್ಚ ಪಾರದರ್ಶಕತೆ ಮತ್ತು ಬಾಹ್ಯ ಪಾಲುದಾರರ ವಿವರಗಳು",
    platform_fee_free: "₹0.00 (ಯಾವಾಗಲೂ ಉಚಿತ)",
    free_public_resources: "ಯಾವುದೇ ಪಾವತಿಸಿದ ಬಾಹ್ಯ ಪಾಲುದಾರರನ್ನು ನಿಯೋಜಿಸಿಲ್ಲ. ಪ್ರಮಾಣಿತ ಸಾರ್ವಜನಿಕ ವಾಹನಗಳನ್ನು ಉಚಿತವಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ.",
    consent_required_msg: "ಬಾಹ್ಯ ಖಾಸಗಿ ಸೇವೆಗಾಗಿ ನಿಮ್ಮ ಸ್ಪಷ್ಟ ಒಪ್ಪಿಗೆ ಅಗತ್ಯವಿದೆ.",
    consent_accepted: "ನಾಗರಿಕರಿಂದ ಅಂಗೀಕರಿಸಲ್ಪಟ್ಟಿದೆ",
    accept_quote: "ದರಪಟ್ಟಿಯನ್ನು ಸ್ವೀಕರಿಸಿ ಮತ್ತು ವಾಹನ ದೃಢೀಕರಿಸಿ",
    decline_quote: "ತಿರಸ್ಕರಿಸಿ (ಉಚಿತ ಪರ್ಯಾಯ ಹುಡುಕಿ)",
    confirm_cancellation: "ರದ್ದತಿಯನ್ನು ದೃಢೀಕರಿಸಿ",
    cancel_details_placeholder: "ಉದಾ. ಸ್ಥಳೀಯ ವೈದ್ಯರು ಆಗಮಿಸಿದ್ದಾರೆ, ರೋಗಿ ಈಗ ಸ್ಥಿರವಾಗಿದ್ದಾರೆ...",
    reason_arranged_independently: "ಸಹಾಯವನ್ನು ಸ್ವತಂತ್ರವಾಗಿ ವ್ಯವಸ್ಥೆ ಮಾಡಲಾಗಿದೆ",
    reason_mistake: "ತಪ್ಪಾಗಿ ವಿನಂತಿ ಸಲ್ಲಿಸಲಾಗಿದೆ",
    reason_resolved: "ತುರ್ತು ಪರಿಸ್ಥಿತಿ ಪರಿಹರಿಸಲಾಗಿದೆ",
    reason_other: "ಇತರ ಕಾರಣ",
    keep_active: "ಸಕ್ರಿಯವಾಗಿರಿಸಿ",
    contact_coordinator: "ಕಮಾಂಡ್ ಸಂಯೋಜಕರನ್ನು ಸಂಪರ್ಕಿಸಿ",
    additional_details: "ಹೆಚ್ಚುವರಿ ವಿವರಗಳು (ಐಚ್ಛಿಕ)",
    reported_at: "ವರದಿ ಮಾಡಿದ ಸಮಯ",
    category: "ಪ್ರಕಾರ",
    emergency_resolved_title: "ತುರ್ತು ಪರಿಸ್ಥಿತಿ ಪರಿಹರಿಸಲಾಗಿದೆ — ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಹಂಚಿಕೊಳ್ಳಿ",
    rate_coordination: "ತುರ್ತು ಸಮನ್ವಯತೆಯನ್ನು ನೀವು ಹೇಗೆ ರೇಟ್ ಮಾಡುತ್ತೀರಿ? (1 - 5 ನಕ್ಷತ್ರಗಳು)",
    rating_label: "ರೇಟಿಂಗ್ (1 - 5 ನಕ್ಷತ್ರಗಳು)",
    written_comments: "ಲಿಖಿತ ಪ್ರತಿಕ್ರಿಯೆ (ಐಚ್ಛಿಕ)",
    feedback_comments_placeholder: "ಸ್ಪಂದನೆಯ ವೇಗ, ಸ್ಪಷ್ಟತೆ ಅಥವಾ ಸಮನ್ವಯಕಾರರ ಬೆಂಬಲದ ಬಗ್ಗೆ ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ ಹಂಚಿಕೊಳ್ಳಿ...",
    feedback_intro: "ನಿಮ್ಮ ಅನುಭವವನ್ನು ಹಂಚಿಕೊಂಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ CareOn ಅನ್ನು ಉತ್ತಮಗೊಳಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
    feedback_thanks: "ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ರೇಟಿಂಗ್ ಗುಣಮಟ್ಟದ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ದಾಖಲಾಗಿದೆ.",
    submit_feedback_title: "ಪ್ರತಿಕ್ರಿಯಾ ಸಮನ್ವಯ ರೇಟಿಂಗ್",

    // User Dashboard Actions
    my_dashboard: "ನನ್ನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    user_action_report_desc: "ಜಿಪಿಎಸ್ ಮೂಲಕ ತುರ್ತು ವೈದ್ಯಕೀಯ, ಅಗ್ನಿಶಾಮಕ ಅಥವಾ ಅಪಘಾತ ವರದಿ ಸಲ್ಲಿಸಿ.",
    user_action_track_desc: "ನೈಜ-ಸಮಯದ ರವಾನೆ ಪ್ರಗತಿ, ವಾಹನದ ಆಗಮನ ಸಮಯ ಮತ್ತು ಟಿಪ್ಪಣಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ.",
    user_action_sahara_desc: "ತುರ್ತು ಮಾರ್ಗದರ್ಶನ, ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ ಅಥವಾ ಸಹಾಯವಾಣಿಗಾಗಿ ಸಹಾರಾ ಜೊತೆ ಮಾತನಾಡಿ.",
    resource_dispatched: "ಪ್ರತಿಕ್ರಿಯಾ ವಾಹನ ನಿಯೋಜಿಸಲಾಗಿದೆ",

    // Sahara Chatbot
    sahara_tagline: "ನಿಮ್ಮ ಕಾಳಜಿಯುಳ್ಳ ತುರ್ತು ಬೆಂಬಲ ಸಹವರ್ತಿ",
    sahara_intro: "ನಮಸ್ಕಾರ! ❤️ ನಾನು ಸಹಾರಾ, ನಿಮ್ಮ ಕಾಳಜಿಯುಳ್ಳ ತುರ್ತು ಬೆಂಬಲ ಸಹವರ್ತಿ. ಗಾಬರಿಯಾಗಬೇಡಿ — ನೆರವು ನಿಮ್ಮ ಸಮೀಪದಲ್ಲಿದೆ. ಏನಾಯಿತು ಎಂದು ತಿಳಿಸಿ ಅಥವಾ ಇನ್ಸಿಡೆಂಟ್ ಕೋಡ್ ನಮೂದಿಸಿ.",
    sahara_typing: "ಸಹಾರಾ ಟೈಪ್ ಮಾಡುತ್ತಿದೆ...",
    ask_sahara_placeholder: "ಸಹಾರಾಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ ಅಥವಾ ಇನ್ಸಿಡೆಂಟ್ ಕೋಡ್ ನಮೂದಿಸಿ...",
    safe_companion: "ಸುರಕ್ಷಿತ ಸಹವರ್ತಿ",
    sahara_offline_reply: "ನಾನು ನಿಮ್ಮೊಂದಿಗೆ ಇದ್ದೇನೆ. ❤️ ನೆಟ್‌ವರ್ಕ್‌ನಲ್ಲಿ ಸಣ್ಣ ಸಮಸ್ಯೆಯಾಗಿದೆ, ತಕ್ಷಣ ನೆರವು ಬೇಕಿದ್ದರೆ ದಯವಿಟ್ಟು 'ತುರ್ತು ವರದಿ' ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ನೇರವಾಗಿ 112 ಕರೆ ಮಾಡಿ.",

    // Auth & General
    admin_login_success: "ದೃಢೀಕರಣ ಯಶಸ್ವಿಯಾಗಿದೆ! ಕಮಾಂಡ್ ಸೆಂಟರ್‌ಗೆ ಮರುನಿರ್ದೇಶಿಸಲಾಗುತ್ತಿದೆ...",
    demo_admin_credentials_hint: "ಡೆಮೊ ಸಂಯೋಜಕರ ಖಾತೆ",
    registration_failed: "ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ.",
    invalid_email: "ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ.",
    password_too_short: "ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು.",
    name_required: "ಪೂರ್ಣ ಹೆಸರು ಅಗತ್ಯವಿದೆ.",
    submit: "ಸಲ್ಲಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",
    comments_label: "ಟಿಪ್ಪಣಿಗಳು ಅಥವಾ ಸಂಯೋಜಕರ ವಿವರ",
    faq_categories_question: "ಯಾವ ತುರ್ತು ವರ್ಗಗಳನ್ನು ಬೆಂಬಲಿಸಲಾಗುತ್ತದೆ?",
    faq_charge_question: "CareOn ಸಮನ್ವಯಕ್ಕಾಗಿ ಯಾವುದೇ ಶುಲ್ಕ ವಿಧಿಸುತ್ತದೆಯೇ?",
    // Privacy Policy
    privacy_title: "ಗೌಪ್ಯತೆ, ನಿಯಮಗಳು ಮತ್ತು ಜವಾಬ್ದಾರಿಯುತ ಪ್ರೋಟೋಟೈಪ್ ಬಹಿರಂಗಪಡಿಸುವಿಕೆ",
    privacy_updated: "ಕೊನೆಯದಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ: ಪ್ರಾಯೋಗಿಕ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಆವೃತ್ತಿ 2026",
    privacy_sec1_title: "1. ಶೈಕ್ಷಣಿಕ ನಿರ್ಧಾರ-ಬೆಂಬಲ ಪ್ರೋಟೋಟೈಪ್ ಸೂಚನೆ",
    privacy_sec1_desc: "CareOn ಶೈಕ್ಷಣಿಕ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಮತ್ತು ಅಧ್ಯಾಪಕರ ಪರಿಶೀಲನೆಗಾಗಿ ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾದ ಬುದ್ಧಿವಂತ ತುರ್ತು ಸಂಪನ್ಮೂಲ ಸಂಯೋಜನಾ ಪ್ರೋಟೋಟೈಪ್ ಆಗಿದೆ. CareOn ಅಧಿಕೃತ ತುರ್ತು ಸೇವೆ, ಪುರಸಭೆಯ 911/112 ಆಪರೇಟರ್, ಪೊಲೀಸ್ ಸೇವೆ ಅಥವಾ ಸರ್ಕಾರಿ ತುರ್ತು ರವಾನೆದಾರರ ಬದಲಿಯಾಗಿಲ್ಲ.",
    privacy_sec2_title: "2. ವೆಚ್ಚದ ಪಾರದರ್ಶಕತೆ ಮತ್ತು ₹0 ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಶುಲ್ಕ",
    privacy_sec2_desc: "ತುರ್ತು ಸಹಾಯವನ್ನು ಕೋರಲು CareOn ನಾಗರಿಕರಿಂದ ಯಾವುದೇ ಕಮಿಷನ್ ಅಥವಾ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಶುಲ್ಕವನ್ನು ವಿಧಿಸುವುದಿಲ್ಲ. ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಸಂಪನ್ಮೂಲಗಳು ಲಭ್ಯವಿಲ್ಲದಿದ್ದರೆ ಮತ್ತು ಬಾಹ್ಯ ಖಾಸಗಿ ಪೂರೈಕೆದಾರರನ್ನು ಸಂಪರ್ಕಿಸಿದರೆ, ಸಂಯೋಜಕರು ಪಾರದರ್ಶಕವಾಗಿ ದರಪಟ್ಟಿಯನ್ನು ಪ್ರದರ್ಶಿಸುತ್ತಾರೆ ಮತ್ತು ಪಾವತಿಸಿದ ನೆರವನ್ನು ರವಾನಿಸುವ ಮೊದಲು ಬಳಕೆದಾರರ ಸಮ್ಮತಿಯನ್ನು ಕೋರುತ್ತಾರೆ.",
    privacy_sec3_title: "3. ಡೇಟಾ ಉಳಿಸಿಕೊಳ್ಳುವಿಕೆ ಮತ್ತು ಜವಾಬ್ದಾರಿಯುತ ನಿರ್ವಹಣೆ",
    privacy_sec3_item1: "ಸಂಬಂಧಿತ ತಜ್ಞರ ಸಹಾಯವನ್ನು ಸಂಯೋಜಿಸಲು ಮಾತ್ರ ಸಂಪರ್ಕ ವಿವರಗಳು ಮತ್ತು ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ.",
    privacy_sec3_item2: "ಪಾಸ್‌ವರ್ಡ್‌ಗಳನ್ನು PBKDF2-HMAC-SHA256 ಸಾಲ್ಟ್‌ಗಳೊಂದಿಗೆ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾಗಿದೆ.",
    privacy_sec3_item3: "ಡೆಮೊ ಪ್ರಾತ್ಯಕ್ಷಿಕೆಗಳಲ್ಲಿರುವ ಎಲ್ಲಾ ಫೋನ್ ಸಂಖ್ಯೆಗಳು ಸುರಕ್ಷಿತ ಕಾಲ್ಪನಿಕ ಸಂಖ್ಯೆಗಳಾಗಿವೆ.",
    privacy_sec3_item4: "ಸಾಮಾನ್ಯ ಬಳಕೆದಾರರು ಮತ್ತೊಬ್ಬ ಬಳಕೆದಾರರ ಖಾಸಗಿ ಘಟನೆ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.",
    privacy_sec3_item5: "ನಿರ್ವಾಹಕರು ಆಡಿಟ್ ಲಾಗಿಂಗ್‌ನೊಂದಿಗೆ ಪಾತ್ರ-ರಕ್ಷಿತ ಕಮಾಂಡ್ ಸೆಂಟರ್ ಪ್ರವೇಶವನ್ನು ಹೊಂದಿದ್ದಾರೆ.",
    privacy_sec4_title: "4. ಸಹಾರಾ ತುರ್ತು ಸಹವರ್ತಿ ಮಿತಿಗಳು",
    privacy_sec4_desc: "ಸಹಾರಾ ಒಂದು ನಿಯಮ-ಆಧಾರಿತ AI ಸಹವರ್ತಿಯಾಗಿದ್ದು, ಇದು ಬೆಂಬಲ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ತುರ್ತು ವಿನಂತಿಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಸಹಾರಾ ವೈದ್ಯಕೀಯ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ರೋಗನಿರ್ಣಯ ಮಾಡುವುದಿಲ್ಲ, ಔಷಧಿಗಳನ್ನು ಶಿಫಾರಸು ಮಾಡುವುದಿಲ್ಲ ಅಥವಾ ಆಗಮನದ ಸಮಯವನ್ನು ಊಹಿಸುವುದಿಲ್ಲ. ತಕ್ಷಣದ ಜೀವ ಬೆದರಿಕೆಗಳಿಗಾಗಿ, ನಾಗರಿಕರನ್ನು ಅಧಿಕೃತ ತುರ್ತು ಸಹಾಯವಾಣಿಗೆ (112 / 108) ನಿರ್ದೇಶಿಸಲಾಗುತ್ತದೆ.",

    // Notification Drawer
    notification_centre_title: "ಅಧಿಸೂಚನಾ ಕೇಂದ್ರ",
    no_notifications_desc: "ಇನ್ನೂ ಯಾವುದೇ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ. ನೈಜ ಸಮಯದಲ್ಲಿ ನವೀಕರಣಗಳು ಇಲ್ಲಿ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತವೆ.",
    mark_read: "ಓದಿದೆ ಎಂದು ಗುರುತಿಸಿ",
    dismiss: "ವಜಾಗೊಳಿಸಿ",
    view_in_drawer: "ಬೆಲ್‌ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ",
    refresh_failed: "ಸರ್ವರ್‌ನಿಂದ ಲೈವ್ ಡೇಟಾ ರಿಫ್ರೆಶ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ.",
    updated_just_now: "ಈಗಷ್ಟೇ ನವೀಕರಿಸಲಾಗಿದೆ",
    acknowledge_alert: "ದೃಢೀಕರಿಸಿ ಮತ್ತು ಮ್ಯೂಟ್ ಮಾಡಿ",
    new_emergency_alert: "🚨 ಹೊಸ ತುರ್ತು ಎಚ್ಚರಿಕೆ: ತಕ್ಷಣದ ಕ್ರಮ ಅಗತ್ಯ",
    alert_acknowledged: "ಎಚ್ಚರಿಕೆಯನ್ನು ದೃಢೀಕರಿಸಲಾಗಿದೆ ಮತ್ತು ಮ್ಯೂಟ್ ಮಾಡಲಾಗಿದೆ.",
    sound_enabled: "ಧ್ವನಿ: ಆನ್",
    sound_disabled: "ಧ್ವನಿ: ಆಫ್",
    view_incident_triage: "ವೀಕ್ಷಿಸಿ ಮತ್ತು ಪರಿಶೀಲಿಸಿ",

    // Admin Dashboard Sections & Cards
    active_incident_queue_title: "ಸಕ್ರಿಯ ತುರ್ತು ಆದ್ಯತಾ ಸರದಿ",
    btn_view_all: "ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ",
    fleet_availability_title: "ವಾಹನ ಲಭ್ಯತೆ ಮತ್ತು ತಕ್ಷಣದ ಕೊರತೆಗಳು",
    fleet_categories_label: "ವಾಹನ ವರ್ಗಗಳು:",
    critical_shortage_detected: "⚠️ ಗಂಭೀರ ಕೊರತೆ ಕಂಡುಬಂದಿದೆ:",
    incident_mgmt_title: "ಘಟನೆ ನಿರ್ವಹಣೆ ಮತ್ತು ಪರಿಶೀಲನಾ ಸರದಿ",
    duplicate_flag_badge: "ನಕಲಿ ಗುರುತು",
    fleet_mgmt_title: "ತುರ್ತು ವಾಹನ ನಿರ್ವಹಣೆ",
    fleet_mgmt_desc: "ವಾಹನಗಳ ಲಭ್ಯತೆ, ನಿರ್ವಹಣಾ ಸ್ಥಿತಿ ಮತ್ತು ಸಕ್ರಿಯ ನಿಯೋಜನೆಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ. ಡೇಟಾಬೇಸ್ ವಹಿವಾಟು ಮಟ್ಟದಲ್ಲಿ ಡಬಲ್-ನಿಯೋಜನೆಯನ್ನು ತಡೆಯಲಾಗುತ್ತದೆ.",
    smart_allocation_engine_title: "ಸ್ಮಾರ್ಟ್ ಸಂಪನ್ಮೂಲ ಹಂಚಿಕೆ ಎಂಜಿನ್",
    smart_allocation_engine_desc: "ಸಂಘರ್ಷ ತಡೆಗಟ್ಟುವಿಕೆಯನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಜಾರಿಗೊಳಿಸುವಾಗ ತುರ್ತುಸ್ಥಿತಿ, ಸಾಮರ್ಥ್ಯ ಹೊಂದಾಣಿಕೆ ಮತ್ತು ಪ್ರಯಾಣದ ಸಮಯವನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತದೆ.",
    active_shortages_mgmt_title: "ಸಕ್ರಿಯ ಸಂಪನ್ಮೂಲ ಕೊರತೆ ನಿರ್ವಹಣೆ",
    active_shortages_mgmt_desc: "ನಗರದ ವಾಹನ ಸಂಪನ್ಮೂಲಗಳು ಖಾಲಿಯಾದಾಗ, ಬಾಹ್ಯ ಪಾಲುದಾರ ಆಸ್ಪತ್ರೆಗಳು ಅಥವಾ ಖಾಸಗಿ ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗಳನ್ನು ಸಂಪರ್ಕಿಸಲು CareOn ಶಿಫಾರಸು ಮಾಡುತ್ತದೆ.",
    no_active_shortages_msg: "✓ ಈ ಸಮಯದಲ್ಲಿ ಯಾವುದೇ ವಾಹನ ಕೊರತೆ ಇಲ್ಲ. ಎಲ್ಲಾ ಕರೆಗಳಿಗೆ ಪ್ರತಿಕ್ರಿಯಾ ವಾಹನಗಳು ಲಭ್ಯವಿದೆ.",
    external_providers_dir_title: "ನೋಂದಾಯಿತ ಪಾಲುದಾರರು ಮತ್ತು ಬಾಹ್ಯ ಪೂರೈಕೆದಾರರ ಡೈರೆಕ್ಟರಿ",
    external_providers_dir_desc: "CareOn ಪಾಲುದಾರ-ಮೊದಲ ತಂತ್ರದೊಂದಿಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ. ಬಾಹ್ಯ ಪೂರೈಕೆದಾರರ ದರಪಟ್ಟಿಗೆ ನಾಗರಿಕರ ಒಪ್ಪಿಗೆ ಅಗತ್ಯವಿದೆ.",
    registered_partner_badge: "ನೋಂದಾಯಿತ ಪಾಲುದಾರ",
    fallback_dir_badge: "ಪರ್ಯಾಯ ಡೈರೆಕ್ಟರಿ",
    live_map_dispatch_title: "ಲೈವ್ ಭೌಗೋಳಿಕ ರವಾನೆ ಮತ್ತು ಟ್ರ್ಯಾಕಿಂಗ್",
    live_map_dispatch_desc: "ಸಕ್ರಿಯ ತುರ್ತು ಪಿನ್‌ಗಳು, ಲಭ್ಯವಿರುವ ವಾಹನಗಳು ಮತ್ತು ಪಾಲುದಾರ ಸೌಲಭ್ಯಗಳನ್ನು ತೋರಿಸುವ ಓಪನ್‌ಸ್ಟ್ರೀಟ್‌ಮ್ಯಾಪ್ ನಕ್ಷೆ.",
    simulation_expo_title: "🎯 ಸಂಪನ್ಮೂಲ ಕೊರತೆ ಸವಾಲು — ಸಂವಾದಾತ್ಮಕ ಮಾರ್ಗದರ್ಶಿ",
    simulation_expo_desc: "ಈ ಸಂವಾದಾತ್ಮಕ ಮಾರ್ಗದರ್ಶಿಯು CareOn ನ ಪ್ರಮುಖ ಸಮನ್ವಯ ಸಾಮರ್ಥ್ಯಗಳನ್ನು ಪ್ರದರ್ಶಿಸುತ್ತದೆ: ಬಹು-ಘಟನೆ ಆದ್ಯತೆ, ಸಂಘರ್ಷ ತಡೆಗಟ್ಟುವಿಕೆ, ಕೊರತೆ ಪತ್ತೆ ಮತ್ತು ಬಾಹ್ಯ ಪೂರೈಕೆದಾರರ ಸಮನ್ವಯ.",
    trust_review_title: "ವರದಿದಾರರ ಪರಿಶೀಲನೆ ಮತ್ತು ನಂಬಿಕೆ ವಿಮರ್ಶೆ",
    trust_review_desc: "ದುರುಪಯೋಗವನ್ನು ತಡೆಯಲು CareOn ನಂಬಿಕೆಯ ಅಂಶಗಳನ್ನು (ದೂರವಾಣಿ ಸ್ವರೂಪ, ಒಟಿಪಿ, ನಕಲುಗಳು, ಇತಿಹಾಸ) ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತದೆ.",
    disaster_mgmt_title: "🌊 ವಿಪತ್ತು ನಿರ್ವಹಣೆ ಮತ್ತು ಸಾಮೂಹಿಕ ಅಪಘಾತ ವಿಸ್ತರಣೆ",
    disaster_mgmt_desc: "ನಗರ ಪ್ರವಾಹ ಅಥವಾ ಕಟ್ಟಡ ಕುಸಿತಕ್ಕೆ ಸಾಮಗ್ರಿಗಳ (ಆಹಾರ, ಕುಡಿಯುವ ನೀರು, ಡೇರೆಗಳು) ಮೇಲ್ವಿಚಾರಣೆ ಮತ್ತು ಸಮನ್ವಯ.",
    available_relief_assets_title: "ಲಭ್ಯವಿರುವ ಪರಿಹಾರ ಸ್ವತ್ತುಗಳು",
    ml_predictor_title: "📊 ನಿಯಮ-ಆಧಾರಿತ ಸಂಪನ್ಮೂಲ ಕೊರತೆ ಅಪಾಯ ಮುನ್ಸೂಚಕ",
    ml_predictor_desc: "ವಲಯ, ದಿನದ ಸಮಯ ಮತ್ತು ಸಕ್ರಿಯ ವಾಹನಗಳ ಆಧಾರದ ಮೇಲೆ ಬೇಡಿಕೆಯ ಹೆಚ್ಚಳವನ್ನು ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತದೆ.",
    ml_predictor_notice: "ಸೂಚನೆ: ಸಂಯೋಜಕರ ನಿರ್ಧಾರ ಬೆಂಬಲಕ್ಕಾಗಿ ನಿಯಮ-ಆಧಾರಿತ ಬೇಡಿಕೆ ಅಂದಾಜು ಮಾದರಿ. ಅಧಿಕೃತ ಪುರಸಭೆಯ ತುರ್ತು ಮುನ್ಸೂಚನೆಯಲ್ಲ.",

    // Badges & Verifications
    flagged_duplicate_badge: "ಹತ್ತಿರದ ನಕಲಿ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ",
    unique_incident_badge: "✓ ಅನನ್ಯ ಘಟನೆ",
    genuine_incident_badge: "ನೈಜ ಘಟನೆ",
    awaiting_otp_label: "ಒಟಿಪಿಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ",
    verified_label: "✓ ದೃಢೀಕರಿಸಲಾಗಿದೆ",

    // KPIs
    kpi_avg_rating: "ಸರಾಸರಿ ಸಂಯೋಜಕರ ರೇಟಿಂಗ್",
    kpi_from_reviews: "14 ಪರಿಶೀಲಿಸಿದ ವಿಮರ್ಶೆಗಳಿಂದ",
    kpi_avg_eta: "ಅಂದಾಜು ಸರಾಸರಿ ಆಗಮನ ಸಮಯ (ETA)",
    kpi_eta_context: "1.25x ಸಂಚಾರ ಅಂಶದೊಂದಿಗೆ ನಗರ ಕಾರಿಡಾರ್",
    kpi_conflict_rate: "ಸಂಘರ್ಷ ತಡೆಗಟ್ಟುವಿಕೆ ದರ",
    kpi_zero_double: "0 ಡಬಲ್-ನಿಯೋಜನೆಗಳು ದಾಖಲಾಗಿವೆ",

    // Admin Details Modal
    lbl_category: "ವರ್ಗ",
    lbl_description: "ವಿವರಣೆ",
    lbl_location: "ಸ್ಥಳ",
    lbl_casualties: "ಬಲಿಪಶುಗಳು / ಸಂತ್ರಸ್ತರು",
    lbl_help_requested: "ವಿನಂತಿಸಿದ ಸಹಾಯ",
    lbl_contact: "ಸಂಪರ್ಕ",
    lbl_initial_priority_reason: "ಆರಂಭಿಕ ಆದ್ಯತೆಯ ಕಾರಣ",
    lbl_coordinator_priority_adj: "ಸಂಯೋಜಕರ ಆದ್ಯತೆ ಹೊಂದಾಣಿಕೆ",
    lbl_available_fleet_units: "ಲಭ್ಯವಿರುವ ವಾಹನ ಘಟಕಗಳು (ನೇರ ನಿಯೋಜನೆ):",

    // Table Headers
    th_verified: "ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    th_incident_code: "ಘಟನೆ ಕೋಡ್",
    th_contact_person: "ಸಂಪರ್ಕ ವ್ಯಕ್ತಿ",
    th_phone_number: "ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
    th_otp_status: "ಒಟಿಪಿ ಸ್ಥಿತಿ",
    th_duplicate_check: "ನಕಲಿ ಪರಿಶೀಲನೆ",
    th_trust_decision: "ನಂಬಿಕೆ ನಿರ್ಧಾರ",
    th_zone: "ಭೌಗೋಳಿಕ ವಲಯ",
    th_predicted_risk: "ಅಂದಾಜು ಕೊರತೆ ಅಪಾಯ",
    th_risk_score: "ಅಪಾಯ ಸ್ಕೋರ್",
    th_resource_in_demand: "ಬೇಡಿಕೆಯಲ್ಲಿರುವ ಸಂಪನ್ಮೂಲ",
    th_time_context: "ಸಮಯದ ಸಂದರ್ಭ",
    th_recommended_action: "ಶಿಫಾರಸು ಮಾಡಿದ ಸಂಯೋಜಕರ ಕ್ರಮ",

    // Buttons
    btn_details: "ವಿವರಗಳು",
    btn_mark_available: "ಲಭ್ಯವಿದೆ ಎಂದು ಗುರುತಿಸಿ",
    btn_set_maintenance: "ನಿರ್ವಹಣೆಗೆ ನಿಗದಿಪಡಿಸಿ",
    btn_simulate_partner_contact: "ಪಾಲುದಾರ ಸಂಪರ್ಕವನ್ನು ಅನುಕರಿಸಿ",
    btn_simulate_contact_quote: "ಸಂಪರ್ಕ ಮತ್ತು ದರಪಟ್ಟಿ ಅನುಕರಿಸಿ",
    btn_pause_movement: "⏸ ಚಲನೆ ಅನುಕರಣೆ ವಿರಾಮಗೊಳಿಸಿ",
    btn_simulate_movement: "▶ ಲೈವ್ ರವಾನೆ ಚಲನೆ ಅನುಕರಿಸಿ",
    btn_reset_scenario: "↺ ಸನ್ನಿವೇಶವನ್ನು ಹಂತ 1 ಕ್ಕೆ ಮರುಹೊಂದಿಸಿ",
    btn_assign_prefix: "+ ನಿಯೋಜಿಸಿ",
    btn_dispatch_relief_van: "ವಿಪತ್ತು ಪರಿಹಾರ ಸರಬರಾಜು ವ್ಯಾನ್ 01 ರವಾನಿಸಿ",
    btn_save_priority_change: "ಆದ್ಯತೆ ಬದಲಾವಣೆ ಉಳಿಸಿ",

    // Simulation Steps
    sim_step1_title: "ಹಂತ 1: ಏಕಕಾಲದಲ್ಲಿ ಅನೇಕ ತುರ್ತುಸ್ಥಿತಿಗಳು",
    sim_step1_desc: "ಮೈಸೂರಿನಲ್ಲಿ ಮೂರು ಏಕಕಾಲೀನ ತುರ್ತುಸ್ಥಿತಿಗಳು ಸಕ್ರಿಯವಾಗಿವೆ (ಸಯ್ಯಾಜಿ ರಾವ್ ರಸ್ತೆ ಹೃದಯಾಘಾತ, ಕುವೆಂಪುನಗರ ರಸ್ತೆ ಅಪಘಾತ, ಮತ್ತು ಗೋಕುಲಂ ಬೆಂಕಿ ಅವಘಡ).",
    sim_step2_title: "ಹಂತ 2: ಸೀಮಿತ ವಾಹನಗಳು (ಕೇವಲ 1 ಆಂಬ್ಯುಲೆನ್ಸ್ ಲಭ್ಯ)",
    sim_step2_desc: "ಆಂಬ್ಯುಲೆನ್ಸ್ 01 ಅನ್ನು CARE-2026-101 ಗೆ ನಿಯೋಜಿಸಲಾಗಿದೆ. ಆಂಬ್ಯುಲೆನ್ಸ್ 03 ನಿರ್ವಹಣೆಯಲ್ಲಿದೆ. ಕೇವಲ ಸಿಟಿಕೇರ್ ಆಂಬ್ಯುಲೆನ್ಸ್ 02 ಮಾತ್ರ ಸಕ್ರಿಯವಾಗಿದೆ.",
    sim_step3_title: "ಹಂತ 3: ಹಂಚಿಕೆಯನ್ನು ಚಲಾಯಿಸಿ ಮತ್ತು ಸಂಘರ್ಷ ತಡೆಗಟ್ಟುವಿಕೆಯನ್ನು ಪ್ರದರ್ಶಿಸಿ",
    sim_step3_desc: "ಸ್ಮಾರ್ಟ್ ಹಂಚಿಕೆದಾರರು ಉಳಿದ ಆಂಬ್ಯುಲೆನ್ಸ್ ಅನ್ನು ಅತ್ಯುನ್ನತ ಆದ್ಯತೆಯ ಕರೆಗೆ ನಿಯೋಜಿಸುತ್ತಾರೆ. ಸಿಸ್ಟಮ್ ಆಕ್ರಮಿತ ವಾಹನವನ್ನು ಮತ್ತೊಂದು ಘಟನೆಗೆ ನಿಯೋಜಿಸುವುದನ್ನು ನಿರ್ಬಂಧಿಸುತ್ತದೆ.",
    sim_step4_title: "ಹಂತ 4: ಕೊರತೆ ಎಚ್ಚರಿಕೆ ಮತ್ತು ಪಾಲುದಾರರ ವಿಚಾರಣೆ",
    sim_step4_desc: "CARE-2026-103 ಗಂಭೀರ ವಾಹನ ಕೊರತೆಯನ್ನು ಎದುರಿಸುತ್ತದೆ. ನೋಂದಾಯಿತ ಪಾಲುದಾರರನ್ನು ಸಂಪರ್ಕಿಸಿ ಮತ್ತು ದರಪಟ್ಟಿಯನ್ನು (₹1,500) ದಾಖಲಿಸಿ.",

    // Quotation & Tracking Labels
    lbl_ext_quotation: "ಬಾಹ್ಯ ಪಾಲುದಾರರ ದರಪಟ್ಟಿ",
    lbl_subsidy_amount: "ಸಹಾಯಧನ / ಎನ್‌ಜಿಒ ಪ್ರಾಯೋಜಕತ್ವ",
    lbl_net_payable: "ಸೇವಾ ಪೂರೈಕೆದಾರರಿಗೆ ಪಾವತಿಸಬೇಕಾದ ಮೊತ್ತ",
    contact_label: "ಸಂಪರ್ಕ",
    mins_label: "ನಿಮಿಷಗಳು",

    // Badges & Common
    urgent_badge: "ತುರ್ತು",
    live_badge: "ಲೈವ್",
    ai_badge: "24/7 AI",
    sahara_safe_companion_desc: "ಸಹಾರಾ ಸಮನ್ವಯ ಬೆಂಬಲವನ್ನು ಒದಗಿಸುತ್ತದೆ. ತಕ್ಷಣದ ಜೀವ ಬೆದರಿಕೆಯ ಸಂದರ್ಭದಲ್ಲಿ ನೇರವಾಗಿ 112 ಕರೆ ಮಾಡಿ.",
    backend_service_status: "ಬ್ಯಾಕೆಂಡ್ ಸೇವಾ ಸ್ಥಿತಿ",
    role_admin: "ನಿರ್ವಾಹಕರು",
    role_user: "ಬಳಕೆದಾರರು",
    language_selector: "ಭಾಷಾ ಆಯ್ಕೆಗಾರ",
    national_helpline_label: "ರಾಷ್ಟ್ರೀಯ ಸಹಾಯವಾಣಿ",
    coordination_email_label: "ಸಮನ್ವಯ",
    mysuru_command_region: "ಮೈಸೂರು ಕಮಾಂಡ್ ಪ್ರದೇಶ, ಕರ್ನಾಟಕ, ಭಾರತ",

    // Map Picker & Legend
    map_picker_hint: "📍 ನಿಖರವಾದ ಮೈಸೂರು ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ನಕ್ಷೆಯನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಪಿನ್ ಎಳೆಯಿರಿ",
    lat_label: "ಅಕ್ಷಾಂಶ",
    lon_label: "ರೇಖಾಂಶ",
    map_legend_incidents: "ತುರ್ತು ಘಟನೆಗಳು",
    map_legend_available: "ಲಭ್ಯವಿರುವ ವಾಹನಗಳು",
    map_legend_dispatched: "ರವಾನಿಸಲಾದ ಘಟಕಗಳು",
    map_legend_partners: "ಪಾಲುದಾರ ಆಸ್ಪತ್ರೆಗಳು ಮತ್ತು ಎನ್‌ಜಿಒಗಳು",
    map_simulation_active: "ವಾಹನ ಚಲನೆ ಸಕ್ರಿಯವಾಗಿದೆ",
    map_center_label: "ಮೈಸೂರು ನಗರ ಪ್ರದೇಶ (12.3052° N, 76.6552° E)",

    // Notification Titles & System Terms
    "Emergency Request Received": "ತುರ್ತು ವಿನಂತಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
    "Ambulance Dispatched": "ಆಂಬ್ಯುಲೆನ್ಸ್ ರವಾನಿಸಲಾಗಿದೆ",
    "Assistance Search Started": "ನೆರವು ಹುಡುಕಾಟ ಪ್ರಾರಂಭವಾಗಿದೆ",
    "Provider Contacted": "ಪೂರೈಕೆದಾರರನ್ನು ಸಂಪರ್ಕಿಸಲಾಗಿದೆ",
    "Provider Quoted": "ಪೂರೈಕೆದಾರರು ದರಪಟ್ಟಿ ನೀಡಿದ್ದಾರೆ",
    "Consent Accepted": "ಸಮ್ಮತಿಯನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
    "Incident Resolved": "ಘಟನೆ ಪರಿಹರಿಸಲಾಗಿದೆ",
    "Request Cancelled": "ವಿನಂತಿ ರದ್ದುಗೊಂಡಿದೆ",
    "Cancellation Acknowledged": "ರದ್ದತಿಯನ್ನು ಅಂಗೀಕರಿಸಲಾಗಿದೆ",
    "Emergency OTP Verified": "ತುರ್ತು ಒಟಿಪಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    "Medical Tele-triage Callback Requested": "ವೈದ್ಯಕೀಯ ಟೆಲಿ-ಟ್ರಯಾಜ್ ಕಾಲ್‌ಬ್ಯಾಕ್ ಕೋರಲಾಗಿದೆ",
    "Doctor Callback Status Updated": "ವೈದ್ಯರ ಕಾಲ್‌ಬ್ಯಾಕ್ ಸ್ಥಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ",
    "New Incident Reported": "ಹೊಸ ತುರ್ತು ಘಟನೆ ವರದಿಯಾಗಿದೆ",
    "Incident Needs Review": "ಘಟನೆಯ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ",
    "Shortage Alert": "ಸಂಪನ್ಮೂಲ ಕೊರತೆ ಎಚ್ಚರಿಕೆ",
    "Duplicate Flagged": "ನಕಲಿ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ",
    "Urgent Action Required": "ತುರ್ತು ಕ್ರಮ ಅಗತ್ಯವಿದೆ",
    "Under Maintenance": "ನಿರ್ವಹಣೆಯಲ್ಲಿದೆ",
    "Available": "ಲಭ್ಯವಿದೆ",
    "Assigned": "ನಿಯೋಜಿಸಲಾಗಿದೆ",
    "Dispatched": "ರವಾನಿಸಲಾಗಿದೆ",
    "System": "ವ್ಯವಸ್ಥೆ",
    "Coordinator": "ಸಂಯೋಜಕರು",
    "Reporter": "ವರದಿದಾರ",


    // Stage 5 & 6: Sahara Voice & Personalized Greetings
    voice_input_tooltip: "ಧ್ವನಿ ಇನ್ಪುಟ್ (ಸಹಾರಾ ಜೊತೆ ಮಾತನಾಡಿ)",
    voice_listening: "ಆಲಿಸುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ",
    voice_unsupported: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬೆಂಬಲಿಸುವುದಿಲ್ಲ",
    voice_permission_error: "ಮೈಕ್ರೋಫೋನ್ ಪ್ರವೇಶವನ್ನು ನಿರಾಕರಿಸಲಾಗಿದೆ ಅಥವಾ ಲಭ್ಯವಿಲ್ಲ",
    personalized_greeting_prefix: "ನಮಸ್ಕಾರ",

    // Stage 5 & 6: Simulated In-App OTP Verification
    otp_verification_title: "ತುರ್ತು ಸಂಪರ್ಕ ಪರಿಶೀಲನೆ (ಸಿಮ್ಯುಲೇಟೆಡ್ ಇನ್-ಆ್ಯಪ್ ಒಟಿಪಿ)",
    otp_verification_desc: "ನಿಮ್ಮ ಸಂಪರ್ಕ ಸಂಖ್ಯೆಗಾಗಿ ಸುರಕ್ಷಿತ ಪರಿಶೀಲನಾ ಕೋಡ್ ರಚಿಸಲಾಗಿದೆ. ಈ ವರದಿಯನ್ನು ಖಚಿತಪಡಿಸಲು ಕೆಳಗೆ 6 ಅಂಕಿಯ ಕೋಡ್ ನಮೂದಿಸಿ.",
    simulated_otp_display: "ಸಿಮ್ಯುಲೇಟೆಡ್ ಕೋಡ್:",
    enter_otp_placeholder: "6 ಅಂಕಿಯ ಕೋಡ್ ನಮೂದಿಸಿ",
    btn_verify_otp: "ಕೋಡ್ ಪರಿಶೀಲಿಸಿ",
    btn_request_new_otp: "ಹೊಸ ಕೋಡ್ ಕೋರಿ",
    otp_verified_badge: "✓ ಫೋನ್ ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    otp_verifying: "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    otp_success_msg: "ತುರ್ತು ಸಂಪರ್ಕ ಫೋನ್ ಯಶಸ್ವಿಯಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.",

    // Stage 5 & 6: Doctor Tele-Triage Callback
    doctor_callback_title: "ವೈದ್ಯರ ಟೆಲಿ-ಟ್ರಯಾಜ್ ಕಾಲ್ಬ್ಯಾಕ್",
    doctor_callback_desc: "ಪ್ರತಿಕ್ರಿಯಾ ತಂಡ ಸಮನ್ವಯಗೊಳ್ಳುತ್ತಿರುವಾಗ ಆನ್-ಕಾಲ್ ವೈದ್ಯಕೀಯ ಸಲಹೆಗಾರರೊಂದಿಗೆ ಟೆಲಿ-ಟ್ರಯಾಜ್ ಸಮಾಲೋಚನೆಗಾಗಿ ವಿನಂತಿಸಿ.",
    btn_request_callback: "ವೈದ್ಯರ ಕಾಲ್ಬ್ಯಾಕ್ ವಿನಂತಿಸಿ",
    chief_complaint_label: "ಮುಖ್ಯ ಲಕ್ಷಣಗಳು / ತುರ್ತು ಸಮಸ್ಯೆ",
    chief_complaint_placeholder: "ರೋಗಿಯ ಸ್ಥಿತಿಯನ್ನು ವಿವರಿಸಿ (ಉದಾ. ಎದೆ ಬಿಗಿತ, ಉಸಿರಾಟದ ತೊಂದರೆ)...",
    callback_disclaimer: "ವೈದ್ಯರ ಕಾಲ್ಬ್ಯಾಕ್ ತುರ್ತು ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ. ಜೀವಕ್ಕೆ ಅಪಾಯಕಾರಿ ತುರ್ತು ಪರಿಸ್ಥಿತಿಗಾಗಿ ತಕ್ಷಣ 112 ಕ್ಕೆ ಕರೆ ಮಾಡಿ.",
    callback_status_pending: "ಕಾಲ್ಬ್ಯಾಕ್ ವಿನಂತಿಸಲಾಗಿದೆ (ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ)",
    callback_status_in_progress: "ಕಾಲ್ಬ್ಯಾಕ್ ಪ್ರಗತಿಯಲ್ಲಿದೆ (ವೈದ್ಯರು ಸಂಪರ್ಕಿಸುತ್ತಿದ್ದಾರೆ)",
    callback_status_contacted: "ವೈದ್ಯಕೀಯ ಸಲಹೆಗಾರರು ನಾಗರಿಕರನ್ನು ಸಂಪರ್ಕಿಸಿದ್ದಾರೆ",
    callback_status_completed: "ಟೆಲಿ-ಟ್ರಯಾಜ್ ಸಮಾಲೋಚನೆ ಪೂರ್ಣಗೊಂಡಿದೆ",
    tab_doctor_callbacks: "🩺 ವೈದ್ಯರ ಕಾಲ್ಬ್ಯಾಕ್‌ಗಳು",
    th_chief_complaint: "ಮುಖ್ಯ ಲಕ್ಷಣ",
    th_callback_status: "ಕಾಲ್ಬ್ಯಾಕ್ ಸ್ಥಿತಿ",
    btn_mark_in_progress: "ಪ್ರಗತಿಯಲ್ಲಿದೆ ಎಂದು ಗುರುತಿಸಿ",
    btn_mark_contacted: "ಸಂಪರ್ಕಿಸಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ",
    btn_mark_completed: "ಪೂರ್ಣಗೊಂಡಿದೆ ಎಂದು ಗುರುತಿಸಿ",

    // Stage 5 & 6: Official Direct Emergency Line
    direct_emergency_line: "ಅಧಿಕೃತ ತುರ್ತು ಸೇವೆಗಳು",

    // Arrival Tracker
    arrival_tracker_title: "ನೆರವು ಮಾರ್ಗದಲ್ಲಿದೆ!",
    arrival_tracker_subtitle: "ನಿಮ್ಮ ತುರ್ತು ವಾಹನ ರವಾನೆಯಾಗಿದ್ದು, ನಿಮ್ಮ ಸ್ಥಳದತ್ತ ಬರುತ್ತಿದೆ.",
    arrival_tracker_eta: "ಅಂದಾಜು ಆಗಮನ",
    arrival_tracker_mins: "ನಿಮಿಷಗಳು",
    arrival_tracker_unit: "ನಿಯೋಜಿತ ವಾಹನ",
    arrival_tracker_demo_badge: "ಡೆಮೊ ಸಿಮ್ಯುಲೇಶನ್",
    arrival_tracker_live_badge: "ಲೈವ್ GPS",
    arrival_confirm_btn: "ನೆರವು ತಲುಪಿದೆ ಎಂದು ದೃಢೀಕರಿಸಿ",
    arrival_confirm_dialog: "ತುರ್ತು ಸಹಾಯಕರು ನಿಮ್ಮ ಸ್ಥಳಕ್ಕೆ ತಲುಪಿದ್ದಾರೆಯೇ?",
    arrival_stage_received: "ವಿನಂತಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
    arrival_stage_dispatched: "ವಾಹನ ರವಾನಿಸಲಾಗಿದೆ",
    arrival_stage_enroute: "ಮಾರ್ಗದಲ್ಲಿದೆ",
    arrival_stage_arrived: "ಸ್ಥಳಕ್ಕೆ ತಲುಪಿದೆ",
    arrival_tracker_map_preview: "ಲೈವ್ ಮಾರ್ಗ ಮುನ್ನೋಟ",
    enlarge_map_btn: "ನಕ್ಷೆಯನ್ನು ದೊಡ್ಡದಾಗಿಸಿ",
    close_map_btn: "ನಕ್ಷೆಯನ್ನು ಮುಚ್ಚಿ",
    enlarged_map_title: "ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ ಮಾರ್ಗ ಮತ್ತು ಟ್ರ್ಯಾಕರ್",
    stay_safe_title: "ಸಹಾಯ ಬರುವವರೆಗೆ ಸುರಕ್ಷಿತವಾಗಿರಿ",
    safety_tips_paused: "ಸಂವಾದದಲ್ಲಿ ವಿರಾಮಗೊಳಿಸಲಾಗಿದೆ",
    safety_tip_med_1: "ವ್ಯಕ್ತಿಯನ್ನು ಆರಾಮವಾಗಿರಿಸಿ ಮತ್ತು ಗಂಭೀರ ಗಾಯವಾಗಿದ್ದರೆ ಅನಗತ್ಯ ಚಲನೆಯನ್ನು ತಪ್ಪಿಸಿ.",
    safety_tip_med_2: "ವ್ಯಕ್ತಿಯ ಸುತ್ತಲೂ ಶುದ್ಧ ಗಾಳಿಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ ಮತ್ತು ಬಿಗಿಯಾದ ಬಟ್ಟೆಯನ್ನು ಸಡಿಲಗೊಳಿಸಿ.",
    safety_tip_med_3: "ಶಾಂತರಾಗಿರಿ, ನಿಮ್ಮ ಫೋನ್ ಲೈನ್ ಮುಕ್ತವಾಗಿಡಿ ಮತ್ತು ವೈದ್ಯಕೀಯ ವಿವರಗಳನ್ನು ಸಿದ್ಧವಾಗಿಡಿ.",
    safety_tip_fire_1: "ಹೊಗೆ ಮತ್ತು ಬೆಂಕಿಯಿಂದ ತಕ್ಷಣ ದೂರ ಸರಿಯಿರಿ. ಲಿಫ್ಟ್‌ಗಳನ್ನು ಬಳಸಬೇಡಿ.",
    safety_tip_fire_2: "ಹೊಗೆಯ ಕೆಳಗೆ ತಗ್ಗಿರಿ, ಅಲ್ಲಿ ಗಾಳಿಯು ಹೆಚ್ಚು ಸ್ವಚ್ಛವಾಗಿರುತ್ತದೆ.",
    safety_tip_fire_3: "ವಸ್ತುಗಳನ್ನು ತರಲು ಸುಡುತ್ತಿರುವ ಕಟ್ಟಡಕ್ಕೆ ಎಂದಿಗೂ ಹಿಂತಿರುಗಬೇಡಿ.",
    safety_tip_road_1: "ಚಲಿಸುವ ವಾಹನಗಳಿಂದ ದೂರವಿರಿ ಮತ್ತು ಸುರಕ್ಷಿತ ಪಾದಚಾರಿ ಮಾರ್ಗದಲ್ಲಿ ನಿರೀಕ್ಷಿಸಿ.",
    safety_tip_road_2: "ಸಾಧ್ಯವಾದರೆ ಬರುವ ವಾಹನಗಳಿಗೆ ಎಚ್ಚರಿಕೆ ನೀಡಲು ವಾಹನದ ಹಜಾರ್ಡ್ ದೀಪಗಳನ್ನು ಆನ್ ಮಾಡಿ.",
    safety_tip_road_3: "ಬೆಂಕಿ ಅಥವಾ ತಕ್ಷಣದ ಅಪಾಯವಿಲ್ಲದಿದ್ದರೆ ಗಂಭೀರವಾಗಿ ಗಾಯಗೊಂಡವರನ್ನು ಚಲಿಸಬೇಡಿ.",
    safety_tip_flood_1: "ತಕ್ಷಣವೇ ಎತ್ತರದ ಪ್ರದೇಶಕ್ಕೆ ಹೋಗಿ ಮತ್ತು ಪ್ರವಾಹದ ನೀರಿನಲ್ಲಿ ನಡೆಯುವುದು ಅಥವಾ ವಾಹನ ಚಲಾಯಿಸುವುದನ್ನು ತಪ್ಪಿಸಿ.",
    safety_tip_flood_2: "ಬಿದ್ದಿರುವ ವಿದ್ಯುತ್ ಕಂಬಗಳು, ತಂತಿಗಳು ಮತ್ತು ಹಾನಿಗೊಳಗಾದ ಗೋಡೆಗಳಿಂದ ದೂರವಿರಿ.",
    safety_tip_flood_3: "ಪಾರುಗಾಣಿಕಾ ತಂಡಕ್ಕಾಗಿ ಕಾಯುತ್ತಿರುವಾಗ ಟಾರ್ಚ್, ಕುಡಿಯುವ ನೀರು ಮತ್ತು ಚಾರ್ಜ್ ಮಾಡಿದ ಫೋನ್ ಸಿದ್ಧವಾಗಿಡಿ.",
    safety_tip_rescue_1: "ಶಿಥಿಲಗೊಂಡ ರಚನೆಗಳು ಮತ್ತು ಬೀಳುವ ಅವಶೇಷಗಳಿಂದ ದೂರವಿರುವ ಸ್ಥಿರ ಸ್ಥಳದಲ್ಲಿರಿ.",
    safety_tip_rescue_2: "ಸಿಲುಕಿಕೊಂಡಿದ್ದರೆ ಶಬ್ದ ಮಾಡಿ ಅಥವಾ ಬೆಳಕಿನ ಸಂಕೇತ ನೀಡಿ, ಅನಗತ್ಯ ಕೂಗಾಟದಿಂದ ಶಕ್ತಿ ವ್ಯರ್ಥ ಮಾಡಬೇಡಿ.",
    safety_tip_rescue_3: "ಬರುವ ರಕ್ಷಣಾ ತಂಡಕ್ಕೆ ಪ್ರವೇಶ ಮಾರ್ಗಗಳನ್ನು ಮುಕ್ತವಾಗಿಡಿ.",
    safety_tip_gen_1: "ಸಹಾಯ ಬರುವವರೆಗೆ ಸಾಧ್ಯವಾದರೆ ಉತ್ತಮ ಬೆಳಕಿರುವ ಸುರಕ್ಷಿತ ಸ್ಥಳದಲ್ಲಿರಿ.",
    safety_tip_gen_2: "ತುರ್ತು ತಂಡ ಅಥವಾ ಸಂಯೋಜಕರು ಸಂಪರ್ಕಿಸಲು ನಿಮ್ಮ ಫೋನ್ ಲೈನ್ ಅನ್ನು ಮುಕ್ತವಾಗಿಡಿ.",
    safety_tip_gen_3: "ವಾಹನವನ್ನು ಗಮನಿಸಲು ಮತ್ತು ತಂಡವನ್ನು ನಿಖರ ಸ್ಥಳಕ್ಕೆ ನಿರ್ದೇಶಿಸಲು ಯಾರಾದರೂ ಕಾದುನೋಡಲಿ.",

    // Call a Doctor
    call_doctor_title: "ವೈದ್ಯರಿಗೆ ಕರೆ ಮಾಡಿ",
    call_doctor_subtitle: "ವೈದ್ಯಕೀಯ ಸಲಹೆಗಾರರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ ಅಥವಾ ತಕ್ಷಣದ ಕಾಲ್‌ಬ್ಯಾಕ್ ಕೋರಿ.",
    call_doctor_btn: "ತುರ್ತು ವೈದ್ಯರ ಕರೆಗೆ ವಿನಂತಿಸಿ",
    call_doctor_direct_108: "108 ವೈದ್ಯಕೀಯ ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗೆ ಕರೆ ಮಾಡಿ",
    call_doctor_notes_placeholder: "ಐಚ್ಛಿಕ: ರೋಗಿಯ ಸ್ಥಿತಿ ಅಥವಾ ಲಕ್ಷಣಗಳನ್ನು ಸಂಕ್ಷಿಪ್ತವಾಗಿ ಬರೆಯಿರಿ",
    call_doctor_success: "ವೈದ್ಯರ ಕರೆ ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಲಾಗಿದೆ. ವೈದ್ಯರು ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತಾರೆ.",
    doctor_calling_unavailable: "ವೈದ್ಯರ ಕರೆ ಸೇವೆ ಪ್ರಸ್ತುತ ಲಭ್ಯವಿಲ್ಲ. ತುರ್ತು ಸಂದರ್ಭಗಳಲ್ಲಿ ನೇರವಾಗಿ 112 ಗೆ ಕರೆ ಮಾಡಿ.",

    // Coordinator Persistent Notifications
    admin_notifications_title: "ಸಂಯೋಜಕರ ಎಚ್ಚರಿಕೆಗಳು",
    admin_notifications_mark_all: "ಎಲ್ಲವನ್ನೂ ಓದಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ",
    admin_notifications_empty: "ಇನ್ನೂ ಯಾವುದೇ ಸಂಯೋಜಕ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ.",

    // Multi-factor Smart Allocation
    alloc_score_label: "ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರ್",
    alloc_auto_dispatch: "ಸ್ವಯಂ-ರವಾನೆಗೆ ಸುರಕ್ಷಿತ",
    alloc_admin_review: "ಸಂಯೋಜಕರ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ",
    alloc_algorithm_badge: "ನಿಯಮ-ಆಧಾರಿತ ಬಹು-ಅಂಶ ಸ್ಕೋರಿಂಗ್ ಎಂಜಿನ್",

    // Progressive Web App (PWA)
    pwa_install_app: "ಆ್ಯಪ್ ಸ್ಥಾಪಿಸಿ",
    pwa_install_careon: "CareOn ಸ್ಥಾಪಿಸಿ",
    pwa_banner_title: "ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ CareOn ಸ್ಥಾಪಿಸಿ",
    pwa_banner_desc: "ತ್ವರಿತ 1-ಟ್ಯಾಪ್ ತುರ್ತು ಪ್ರವೇಶಕ್ಕಾಗಿ ನಿಮ್ಮ ಮುಖಪುಟ ಪರದೆಗೆ CareOn ಸೇರಿಸಿ.",
    pwa_install_btn: "ಈಗಲೇ ಸ್ಥಾಪಿಸಿ",
    pwa_dismiss_btn: "ಈಗ ಬೇಡ",
    pwa_ios_title: "ನಿಮ್ಮ iPhone ನಲ್ಲಿ CareOn ಸ್ಥಾಪಿಸಿ",
    pwa_ios_subtitle: "ನಿಮ್ಮ ಮುಖಪುಟ ಪರದೆಗೆ CareOn ಸೇರಿಸಲು Safari ನಲ್ಲಿ ಈ ಹಂತಗಳನ್ನು ಅನುಸರಿಸಿ:",
    pwa_ios_step1: "1. Safari ಯ ಕೆಳಭಾಗದಲ್ಲಿರುವ ಹಂಚಿಕೆ (Share) ಬಟನ್ ಟ್ಯಾಪ್ ಮಾಡಿ.",
    pwa_ios_step2: "2. ಕೆಳಗೆ ಸ್ಕ್ರೋಲ್ ಮಾಡಿ ಮತ್ತು 'Add to Home Screen' ಆಯ್ಕೆಮಾಡಿ.",
    pwa_ios_step3: "3. ಸ್ಥಾಪಿಸಲು ಮೇಲಿನ ಬಲ ಮೂಲೆಯಲ್ಲಿ 'Add' ಟ್ಯಾಪ್ ಮಾಡಿ.",
    pwa_instructions_close: "ಅರ್ಥವಾಯಿತು",
    pwa_already_installed: "ಆ್ಯಪ್ ಸ್ಥಾಪಿಸಲಾಗಿದೆ",
    pwa_android_other_title: "CareOn ಮುಖಪುಟ ಪರದೆಗೆ ಸೇರಿಸಿ",
    pwa_android_other_desc: "ನಿಮ್ಮ ಬ್ರೌಸರ್ ಮೆನು (⋮) ಟ್ಯಾಪ್ ಮಾಡಿ ಮತ್ತು 'Install App' ಅಥವಾ 'Add to Home screen' ಆಯ್ಕೆಮಾಡಿ.",
  },
};


export function useTranslation(lang = 'en') {
  const dict = translations[lang] || translations.en;

  const translateDynamicMessage = (str, targetLang) => {
    if (!str || typeof str !== 'string' || targetLang === 'en') return null;

    // Dynamic backend timeline & notification patterns
    // 1. Emergency request received / Assigned Incident Code
    let m = str.match(/^Emergency request received\. Unique Tracking ID: ([\w-]+)\.?$/i) ||
            str.match(/^Emergency report received\. Assigned Incident Code ([\w-]+)\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `आपातकालीन रिपोर्ट प्राप्त हुई। विशिष्ट ट्रैकिंग कोड: ${m[1]}।`
        : `ತುರ್ತು ವರದಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ವಿಶಿಷ್ಟ ಟ್ರ್ಯಾಕಿಂಗ್ ಕೋಡ್: ${m[1]}.`;
    }

    // 2. Incident confirmed by phone contact with Demo User
    m = str.match(/^Incident confirmed by phone contact with (.+?)\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `${m[1]} के साथ फोन संपर्क द्वारा घटना की पुष्टि की गई।`
        : `${m[1]} ಅವರೊಂದಿಗೆ ದೂರವಾಣಿ ಸಂಪರ್ಕದ ಮೂಲಕ ಘಟನೆಯನ್ನು ದೃಢೀಕರಿಸಲಾಗಿದೆ.`;
    }

    // 3. Resource assigned to incident
    m = str.match(/^(.+?) assigned to incident\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `${m[1]} को आपातकाल के लिए सौंपा गया।`
        : `${m[1]} ಅನ್ನು ಘಟನೆಗೆ ನಿಯೋಜಿಸಲಾಗಿದೆ.`;
    }

    // 4. Resource en route with siren activated. ETA X mins
    m = str.match(/^(.+?) en route with siren activated\. ETA (\d+) mins\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `${m[1]} सायरन के साथ रवाना है। अनुमानित समय ~${m[2]} मिनट।`
        : `${m[1]} ಸೈರನ್‌ನೊಂದಿಗೆ ಸಾಗುತ್ತಿದೆ. ಅಂದಾಜು ಆಗಮನ ಸಮಯ ~${m[2]} ನಿಮಿಷಗಳು.`;
    }

    // 5. Paramedics stabilized jogger and safely discharged onsite
    if (/^Paramedics stabilized jogger and safely discharged onsite\.?$/i.test(str)) {
      return targetLang === 'hi'
        ? "पैरामेडिक्स ने व्यक्ति की स्थिति स्थिर की और सुरक्षित रूप से मौके पर प्राथमिक उपचार पूरा किया।"
        : "ಪ್ಯಾರಾಮೆಡಿಕ್ಸ್ ವ್ಯಕ್ತಿಯನ್ನು ಉಪಚರಿಸಿ ಸ್ಥಳದಲ್ಲೇ ಸ್ಥಿರಗೊಳಿಸಿದರು.";
    }

    // 6. Contact, Resource has been dispatched to your location. ETA ~Z mins.
    m = str.match(/^(.+?), (.+?) has been dispatched to your location\. ETA ~(\d+) mins\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `${m[1]}, ${m[2]} को आपके स्थान के लिए रवाना कर दिया गया है। अनुमानित समय ~${m[3]} मिनट।`
        : `${m[1]}, ${m[2]} ಅನ್ನು ನಿಮ್ಮ ಸ್ಥಳಕ್ಕೆ ರವಾನಿಸಲಾಗಿದೆ. ಅಂದಾಜು ಆಗಮನ ಸಮಯ ~${m[3]} ನಿಮಿಷಗಳು.`;
    }

    // 7. Contact, resource has been dispatched to location
    m = str.match(/^(.+?), (.+?) has been dispatched to (.+?)\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `${m[1]}, ${m[2]} को ${m[3]} के लिए रवाना कर दिया गया है।`
        : `${m[1]}, ${m[2]} ಅನ್ನು ${m[3]} ಗೆ ರವಾನಿಸಲಾಗಿದೆ.`;
    }

    // 7. Contact, your request has been received...
    m = str.match(/^(.+?), your request has been received\. Our coordinator will review the details\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `${m[1]}, आपका अनुरोध प्राप्त हो गया है। हमारे समन्वयक शीघ्र विवरण की समीक्षा करेंगे।`
        : `${m[1]}, ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ನಮ್ಮ ಸಂಯೋಜಕರು ಶೀಘ್ರದಲ್ಲೇ ಪರಿಶೀಲಿಸುತ್ತಾರೆ.`;
    }

    // 8. Phone contact verified via emergency OTP
    m = str.match(/^Phone contact verified via emergency OTP (?:by reporter|for) (.+?)\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `नागरिक ${m[1]} द्वारा आपातकालीन ओटीपी के माध्यम से फ़ोन संपर्क सत्यापित किया गया।`
        : `ನಾಗರಿಕ ${m[1]} ರವರಿಂದ ತುರ್ತು ಒಟಿಪಿ ಮೂಲಕ ದೂರವಾಣಿ ಸಂಪರ್ಕ ದೃಢೀಕರಿಸಲಾಗಿದೆ.`;
    }

    // 9. Your emergency contact has been verified. Coordinator is assigning assistance
    if (/^Your emergency contact has been verified\. Coordinator is assigning assistance\.?$/i.test(str)) {
      return targetLang === 'hi'
        ? "आपका आपातकालीन संपर्क सत्यापित हो गया है। समन्वयक सहायता आवंटित कर रहे हैं।"
        : "ನಿಮ್ಮ ತುರ್ತು ಸಂಪರ್ಕವನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ಸಂಯೋಜಕರು ನೆರವು ನಿಯೋಜಿಸುತ್ತಿದ್ದಾರೆ.";
    }

    // 10. Medical tele-triage / doctor callback requested
    m = str.match(/^(?:Medical tele-triage callback|Doctor call) requested (?:by reporter|for) (.+?)\.\s*Status:\s*(.+?)\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `नागरिक ${m[1]} द्वारा डॉक्टर परामर्श का अनुरोध किया गया। स्थिति: ${m[2]}।`
        : `ನಾಗರಿಕ ${m[1]} ರವರಿಂದ ವೈದ್ಯರ ನೆರವು ಕೋರಲಾಗಿದೆ. ಸ್ಥಿತಿ: ${m[2]}.`;
    }

    // 11. Reporter / Citizen requested medical callback
    m = str.match(/^(?:Reporter|Citizen)\s+(.+?)\s+requested (?:a medical callback|doctor assistance):\s*(.+?)\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `नागरिक ${m[1]} ने डॉक्टर परामर्श का अनुरोध किया: ${m[2]}`
        : `ನಾಗರಿಕ ${m[1]} ರವರು ವೈದ್ಯರ ನೆರವು ಕೋರಿದ್ದಾರೆ: ${m[2]}`;
    }

    // 12. Doctor callback request status updated
    m = str.match(/^Doctor callback request status updated to '(.+?)' by (.+?)\.?(?: Notes: (.+))?$/i);
    if (m) {
      const notesPart = m[3] ? (targetLang === 'hi' ? ` (नोट्स: ${m[3]})` : ` (ಟಿಪ್ಪಣಿ: ${m[3]})`) : '';
      return targetLang === 'hi'
        ? `${m[2]} द्वारा डॉक्टर कॉलबैक अनुरोध स्थिति बदलकर '${m[1]}' कर दी गई।${notesPart}`
        : `${m[2]} ರವರಿಂದ ವೈದ್ಯರ ಕಾಲ್‌ಬ್ಯಾಕ್ ವಿನಂತಿಯ ಸ್ಥಿತಿಯನ್ನು '${m[1]}' ಗೆ ನವೀಕರಿಸಲಾಗಿದೆ.${notesPart}`;
    }

    // 13. Your medical tele-triage callback request for incident #X has been marked as 'Y'
    m = str.match(/^Your medical tele-triage callback request for incident #(\d+) has been marked as '(.+?)'\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `घटना #${m[1]} के लिए आपका मेडिकल कॉलबैक अनुरोध '${m[2]}' चिह्नित किया गया है।`
        : `ಘಟನೆ #${m[1]} ಗಾಗಿ ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಕಾಲ್‌ಬ್ಯಾಕ್ ವಿನಂತಿಯನ್ನು '${m[2]}' ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ.`;
    }

    // 14. Priority adjusted from X to Y. Reason: Z
    m = str.match(/^Priority adjusted from (.+?) to (.+?)\. Reason: (.+?)$/i);
    if (m) {
      return targetLang === 'hi'
        ? `प्राथमिकता ${m[1]} से बदलकर ${m[2]} की गई। कारण: ${m[3]}`
        : `ಆದ್ಯತೆಯನ್ನು ${m[1]} ರಿಂದ ${m[2]} ಗೆ ಹೊಂದಿಸಲಾಗಿದೆ. ಕಾರಣ: ${m[3]}`;
    }

    // 15. Request cancelled by X. Reason: Y. Resources flagged for safe release.
    m = str.match(/^Request cancelled by (.+?)\. Reason: (.+?)\. Resources flagged for safe release\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `${m[1]} द्वारा अनुरोध रद्द किया गया। कारण: ${m[2]}। संसाधन सुरक्षित रूप से मुक्त किए गए।`
        : `${m[1]} ರವರಿಂದ ವಿನಂತಿ ರದ್ದುಗೊಂಡಿದೆ. ಕಾರಣ: ${m[2]}. ವಾಹನಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಬಿಡುಗಡೆ ಮಾಡಲಾಗಿದೆ.`;
    }

    // 16. Reporter cancelled CODE (Reason: X). Please confirm safe resource release.
    m = str.match(/^Reporter cancelled ([\w-]+) \(Reason: (.+?)\)\. Please confirm safe resource release\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `रिपोर्टर ने ${m[1]} रद्द किया (कारण: ${m[2]})। कृपया संसाधन मुक्ति की पुष्टि करें।`
        : `ವರದಿದಾರರು ${m[1]} ರದ್ದುಗೊಳಿಸಿದ್ದಾರೆ (ಕಾರಣ: ${m[2]}). ದಯವಿಟ್ಟು ಸಂಪನ್ಮೂಲ ಬಿಡುಗಡೆಯನ್ನು ದೃಢೀಕರಿಸಿ.`;
    }

    // 17. Coordinator acknowledged cancellation. All assigned resources safely released to available fleet.
    if (/^Coordinator acknowledged cancellation\. All assigned resources safely released to available fleet\.?$/i.test(str)) {
      return targetLang === 'hi'
        ? "समन्वयक ने रद्दीकरण स्वीकार किया। सभी सौंपे गए संसाधन उपलब्ध बेड़े में सुरक्षित रूप से मुक्त किए गए।"
        : "ಸಂಯೋಜಕರು ರದ್ದತಿಯನ್ನು ಅಂಗೀಕರಿಸಿದ್ದಾರೆ. ನಿಯೋಜಿಸಲಾದ ಎಲ್ಲಾ ವಾಹನಗಳು ಮರಳಿ ಲಭ್ಯವಿವೆ.";
    }

    // 18. Incident safely resolved. Field teams returned to base.
    if (/^Incident safely resolved\. Field teams returned to base\.?$/i.test(str)) {
      return targetLang === 'hi'
        ? "आपातकाल सुरक्षित रूप से हल हो गया। फील्ड टीमें बेस पर लौट आईं।"
        : "ತುರ್ತು ಪರಿಸ್ಥಿತಿ ಸುರಕ್ಷಿತವಾಗಿ ಪರಿಹರಿಸಲಾಗಿದೆ. ರಕ್ಷಣಾ ತಂಡಗಳು ಬೇಸ್‌ಗೆ ಮರಳಿವೆ.";
    }

    // 19. Contact, your request CODE has been resolved. We hope you are safe.
    m = str.match(/^(.+?), your request ([\w-]+) has been resolved\. We hope you are safe\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `${m[1]}, आपका अनुरोध ${m[2]} सुरक्षित रूप से हल हो गया है। आशा है कि आप सुरक्षित हैं।`
        : `${m[1]}, ನಿಮ್ಮ ವಿನಂತಿ ${m[2]} ಯಶಸ್ವಿಯಾಗಿ ಪರಿಹರಿಸಲಾಗಿದೆ. ನೀವು ಸುರಕ್ಷಿತವಾಗಿರುವಿರಿ ಎಂದು ನಾವು ಭಾವಿಸುತ್ತೇವೆ.`;
    }

    // 20. Resource X (Y) confirmed and dispatched. Estimated ETA ~Z mins.
    m = str.match(/^Resource (.+?) \((.+?)\) confirmed and dispatched\. Estimated ETA ~(\d+) mins\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `संसाधन ${m[1]} (${m[2]}) की पुष्टि की गई और रवाना किया गया। अनुमानित समय ~${m[3]} मिनट।`
        : `ಸಂಪನ್ಮೂಲ ${m[1]} (${m[2]}) ದೃಢೀಕರಿಸಿ ರವಾನಿಸಲಾಗಿದೆ. ಅಂದಾಜು ಆಗಮನ ಸಮಯ ~${m[3]} ನಿಮಿಷಗಳು.`;
    }

    // 21. Contact, Resource has been dispatched to your location. ETA ~Z mins.
    m = str.match(/^(.+?), (.+?) has been dispatched to your location\. ETA ~(\d+) mins\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `${m[1]}, ${m[2]} को आपके स्थान के लिए रवाना कर दिया गया है। अनुमानित समय ~${m[3]} मिनट।`
        : `${m[1]}, ${m[2]} ಅನ್ನು ನಿಮ್ಮ ಸ್ಥಳಕ್ಕೆ ರವಾನಿಸಲಾಗಿದೆ. ಅಂದಾಜು ಆಗಮನ ಸಮಯ ~${m[3]} ನಿಮಿಷಗಳು.`;
    }

    // 22. Coordinator contacted external partner X (Y)
    m = str.match(/^Coordinator contacted external partner (.+?) \((.+?)\)\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `समन्वयक ने बाहरी साझेदार ${m[1]} (${m[2]}) से संपर्क किया।`
        : `ಸಂಯೋಜಕರು ಬಾಹ್ಯ ಪಾಲುದಾರ ${m[1]} (${m[2]}) ಅನ್ನು ಸಂಪರ್ಕಿಸಿದ್ದಾರೆ.`;
    }

    // 23. External provider quoted ₹X. Awaiting user approval.
    m = str.match(/^External provider quoted ₹([\d,]+)\. Awaiting user approval\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `बाहरी प्रदाता ने ₹${m[1]} का उद्धरण दिया। उपयोगकर्ता अनुमोदन की प्रतीक्षा है।`
        : `ಬಾಹ್ಯ ಪೂರೈಕೆದಾರರು ₹${m[1]} ದರಪಟ್ಟಿಯನ್ನು ನೀಡಿದ್ದಾರೆ. ಬಳಕೆದಾರರ ಅನುಮೋದನೆಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ.`;
    }

    // 24. A partner provider is available for ₹X. Please review and approve in your tracking page.
    m = str.match(/^A partner provider is available for ₹([\d,]+)\. Please review and approve in your tracking page\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `₹${m[1]} में एक साझेदार प्रदाता उपलब्ध है। कृपया अपने ट्रैकिंग पृष्ठ पर समीक्षा करें और स्वीकृति दें।`
        : `₹${m[1]} ದರದಲ್ಲಿ ಪಾಲುದಾರ ಪೂರೈಕೆದಾರರು ಲಭ್ಯವಿದ್ದಾರೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಟ್ರ್ಯಾಕಿಂಗ್ ಪುಟದಲ್ಲಿ ಅನುಮೋದಿಸಿ.`;
    }

    // 25. User accepted provider quote (₹X). External dispatch confirmed.
    m = str.match(/^User accepted provider quote \(₹([\d,]+)\)\. External dispatch confirmed\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `उपयोगकर्ता ने प्रदाता उद्धरण (₹${m[1]}) स्वीकार किया। बाहरी प्रेषण की पुष्टि की गई।`
        : `ಬಳಕೆದಾರರು ಪೂರೈಕೆದಾರರ ದರಪಟ್ಟಿಯನ್ನು (₹${m[1]}) ಒಪ್ಪಿಕೊಂಡಿದ್ದಾರೆ. ಬಾಹ್ಯ ರವಾನೆ ದೃಢೀಕರಿಸಲಾಗಿದೆ.`;
    }

    // 26. Request CODE: MSG
    m = str.match(/^Request ([\w-]+): (.+)$/i);
    if (m) {
      const sub = translateDynamicMessage(m[2], targetLang) || m[2];
      return targetLang === 'hi'
        ? `अनुरोध ${m[1]}: ${sub}`
        : `ವಿನಂತಿ ${m[1]}: ${sub}`;
    }

    // 27. Emergency Verification Code (CODE)
    m = str.match(/^Emergency Verification Code \(([\w-]+)\)$/i);
    if (m) {
      return targetLang === 'hi'
        ? `आपातकालीन सत्यापन कोड (${m[1]})`
        : `ತುರ್ತು ಪರಿಶೀಲನಾ ಕೋಡ್ (${m[1]})`;
    }

    // 28. Your CareOn verification code is: OTP. Enter this code in the verification box to continue. (In-App Demo OTP)
    m = str.match(/^Your CareOn verification code is:\s*(\d{6})\.\s*Enter this code in the verification box to continue\.\s*\(In-App Demo OTP\)$/i);
    if (m) {
      return targetLang === 'hi'
        ? `आपका CareOn सत्यापन कोड है: ${m[1]}। जारी रखने के लिए इस कोड को सत्यापन बॉक्स में दर्ज करें। (इन-ऐप डेमो ओटीपी)`
        : `ನಿಮ್ಮ CareOn ಪರಿಶೀಲನಾ ಕೋಡ್: ${m[1]}. ಮುಂದುವರಿಯಲು ಪರಿಶೀಲನಾ ಪೆಟ್ಟಿಗೆಯಲ್ಲಿ ಈ ಕೋಡ್ ಅನ್ನು ನಮೂದಿಸಿ. (ಇನ್-ಆಪ್ ಡೆಮೊ ಒಟಿಪಿ)`;
    }

    // 29. Invalid verification code. Attempts remaining: X.
    m = str.match(/^Invalid verification code\.\s*Attempts remaining:\s*(\d+)\.?$/i);
    if (m) {
      return targetLang === 'hi'
        ? `अमान्य सत्यापन कोड। शेष प्रयास: ${m[1]}।`
        : `ಅಮಾನ್ಯ ಪರಿಶೀಲನಾ ಕೋಡ್. ಉಳಿದಿರುವ ಪ್ರಯತ್ನಗಳು: ${m[1]}.`;
    }

    // 30. Maximum verification attempts exceeded (5/5). Please request a new emergency verification code.
    if (/^Maximum verification attempts exceeded.*$/i.test(str)) {
      return targetLang === 'hi'
        ? "अधिकतम सत्यापन प्रयास पार हो गए (5/5)। कृपया एक नया आपातकालीन सत्यापन कोड अनुरोध करें।"
        : "ಗರಿಷ್ಠ ಪರಿಶೀಲನಾ ಪ್ರಯತ್ನಗಳನ್ನು ಮೀರಿದೆ (5/5). ದಯವಿಟ್ಟು ಹೊಸ ತುರ್ತು ಪರಿಶೀಲನಾ ಕೋಡ್ ಅನ್ನು ವಿನಂತಿಸಿ.";
    }

    // 31. Emergency verification code has expired. Please request a new code.
    if (/^Emergency verification code has expired.*$/i.test(str)) {
      return targetLang === 'hi'
        ? "आपातकालीन सत्यापन कोड समाप्त हो गया है। कृपया एक नया कोड अनुरोध करें।"
        : "ತುರ್ತು ಪರಿಶೀಲನಾ ಕೋಡ್ ಮುಕ್ತಾಯಗೊಂಡಿದೆ. ದಯವಿಟ್ಟು ಹೊಸ ಕೋಡ್ ಅನ್ನು ವಿನಂತಿಸಿ.";
    }

    // 32. Incident is already verified. Reusing verification code is not allowed.
    if (/^Incident is already verified.*$/i.test(str)) {
      return targetLang === 'hi'
        ? "घटना पहले ही सत्यापित हो चुकी है। सत्यापन कोड का पुन: उपयोग करने की अनुमति नहीं है।"
        : "ಘಟನೆಯನ್ನು ಈಗಾಗಲೇ ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ಪರಿಶೀಲನಾ ಕೋಡ್ ಅನ್ನು ಮರುಬಳಕೆ ಮಾಡಲು ಅನುಮತಿಸಲಾಗುವುದಿಲ್ಲ.";
    }

    return null;
  };

  const translateFn = (key, fallback = '') => {
    if (!key && key !== 0) return fallback || '';
    if (typeof key !== 'string') return String(key);

    const trimmed = key.trim();
    const keyLower = trimmed.toLowerCase();
    const keyUpper = trimmed.toUpperCase();

    // 1. Exact or case-insensitive match in active dictionary
    if (dict?.[trimmed] !== undefined && dict[trimmed] !== '') return dict[trimmed];
    if (dict?.[keyLower] !== undefined && dict[keyLower] !== '') return dict[keyLower];
    if (dict?.[keyUpper] !== undefined && dict[keyUpper] !== '') return dict[keyUpper];

    // Check status_ or cat_ or priority_ prefixes in active dictionary
    if (dict?.[`status_${keyLower.replace(/ /g, '_')}`] !== undefined) return dict[`status_${keyLower.replace(/ /g, '_')}`];
    if (dict?.[`cat_${keyLower.replace(/ /g, '_')}`] !== undefined) return dict[`cat_${keyLower.replace(/ /g, '_')}`];
    if (dict?.[`priority_${keyLower.replace(/ /g, '_')}`] !== undefined) return dict[`priority_${keyLower.replace(/ /g, '_')}`];

    // 2. Dynamic message pattern translation for Hindi and Kannada
    if (lang === 'hi' || lang === 'kn') {
      const dynamicResult = translateDynamicMessage(trimmed, lang);
      if (dynamicResult) return dynamicResult;
    }

    // 3. Exact or case-insensitive match in English dictionary
    if (translations.en?.[trimmed] !== undefined && translations.en[trimmed] !== '') return translations.en[trimmed];
    if (translations.en?.[keyLower] !== undefined && translations.en[keyLower] !== '') return translations.en[keyLower];
    if (translations.en?.[keyUpper] !== undefined && translations.en[keyUpper] !== '') return translations.en[keyUpper];

    // 4. Explicit fallback parameter provided
    if (fallback !== undefined && fallback !== '') return fallback;

    // 5. Humanize internal identifiers (snake_case or SCREAMING_SNAKE_CASE) to clean Title Case
    if (trimmed.includes('_') || (trimmed.length > 3 && trimmed === keyUpper)) {
      return trimmed
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    return key;
  };

  return new Proxy(translateFn, {
    get(target, prop) {
      if (prop === 't') return translateFn;
      if (prop === 'dict') return dict;
      if (prop === 'translations') return translations;
      if (typeof prop === 'string') {
        const val = translateFn(prop);
        if (val) return val;
      }
      return target[prop];
    },
    apply(target, thisArg, argumentsList) {
      return Reflect.apply(target, thisArg, argumentsList);
    }
  });
}