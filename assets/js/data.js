/* =========================================================
   INSIA Lab: single source of truth for site content.
   Edit this file to add news, publications or team members;
   every page re-renders from it.

   Images live in assets/img/ (team/, news/). Use WebP, ~720px wide
   for portraits and ~1400px for figures.
   ========================================================= */

window.INSIA = {
  /* ── ON THE BENCH ─────────────────────────────────────────────
     The "what we're working on right now" card on the home page.
     To update: change `updated`, then edit/add/remove lines in
     `items`. Each item is plain text; add `link` to make it
     clickable. Keep it to ~4–6 short lines.                     */
  bench: {
    updated: "Nov 2026",
    items: [
      { text: "MIST research grant approved: privacy-preserving handheld fingerprint attendance system for MIST and higher-education institutions in Bangladesh" },
      { text: "IEEE/CAA Journal of Automatica Sinica paper on WVD-MODWT accepted (IF 19.2)" },
      { text: "MoST-funded project: smartphone-based distracted-walking detection with on-device AI" },
      { text: "High-resolution ECG time–frequency work heading to IEEE SPMB 2026" },
      { text: "Best Presentation Award at IEEE QPAIN 2026 for EEG cognitive-load classification" },
      { text: "Recruiting graduate and undergraduate members", link: "mailto:newajfaisal@gmail.com?subject=INSIA%20Lab%20%E2%80%93%20Prospective%20Member" },
    ],
  },

  lab: {
    name: "INSIA Lab",
    full: "Intelligent Next-gen Signal & Image Analysis Lab",
    email: "newajfaisal@gmail.com",
    emailOfficial: "newaj@eece.mist.ac.bd",
    facebook: "https://www.facebook.com/profile.php?id=61591459341789",
    linkedin: "https://www.linkedin.com/company/insia-lab",
    institution: "Military Institute of Science and Technology (MIST)",
    institutionUrl: "https://mist.ac.bd/",
  },

  directions: [
    { title: "Signal Representation & Analysis", glyph: "tf",
      text: "Principled methods for representing non-stationary signals: time–frequency analysis, adaptive signal decomposition, and statistical estimation and detection." },
    { title: "Intelligent Sensing", glyph: "radar",
      text: "Learning-based systems that interpret radar, wearable and inertial sensor data, built for robust perception in unconstrained environments." },
    { title: "Biomedical & Neural Signal Processing", glyph: "ecg",
      text: "Computational tools for physiological and brain signals, with applications in healthcare, assistive technology and brain–computer interfaces." },
    { title: "Human–Machine Interaction", glyph: "hmi",
      text: "Using signals from the human body to enable natural, reliable communication between people and machines." },
    { title: "Image & Multidimensional Data", glyph: "grid",
      text: "Extending signal-processing principles to images and higher-dimensional data for recognition and understanding." },
  ],

  news: [
    { title: "High-Resolution Time-Frequency Representation for ECG Signal Analysis", venue: "IEEE SPMB Symposium 2026", type: "Conference", year: 2026,
      image: "assets/img/news/ecg-tfr.webp" },
    { title: "Single-Channel Wearable EEG for ADL Recognition in Healthy and Epileptic Patients", venue: "Biomedical Signal Processing and Control", if: "5.7", type: "Journal", year: 2026,
      link: "https://www.sciencedirect.com/science/article/pii/S1746809426021580" },
    { title: "Radar-Based Sleep Posture Transition Sensing Utilizing Depthwise Convolution", venue: "IEEE Sensors Letters", if: "2.4", type: "Journal", year: 2026,
      link: "https://ieeexplore.ieee.org/document/11594419",
      image: "assets/img/news/radar-sleep.webp" },
    { title: "IMU–MMG-Based Hand Gesture Recognition", venue: "IEEE Sensors Journal", if: "4.5", type: "Journal", year: 2026,
      link: "https://ieeexplore.ieee.org/document/11508135",
      image: "assets/img/news/imu-mmg.webp" },
    { title: "Cross-Subject Driver Drowsiness Detection using Single-Channel EEG Signal", venue: "IEEE Sensors Journal", if: "4.5", type: "Journal", year: 2026,
      link: "https://ieeexplore.ieee.org/document/11459382",
      image: "assets/img/news/driver-drowsiness.webp" },
    { title: "Synchroextracting Transform-Enhanced Improved FMCW Radar Sensing for HAR Systems", venue: "IEEE Sensors Letters", if: "2.4", type: "Journal", year: 2026,
      link: "https://ieeexplore.ieee.org/abstract/document/11419777",
      image: "assets/img/news/set-radar-har.webp" },
    { title: "Two-Dimensional Successive Variational Mode Decomposition", venue: "IEEE Signal Processing Letters", if: "3.2", type: "Journal", year: 2025,
      link: "https://doi.org/10.1109/LSP.2025.3561632",
      image: "assets/img/news/2d-svmd.webp" },
    { title: "EEG-based Unified & Multiple Neurodevelopmental Disorders Detection in Children", venue: "IEEE Trans. Cognitive and Developmental Systems", if: "5.0", type: "Journal", year: 2025,
      link: "https://ieeexplore.ieee.org/abstract/document/10946857",
      image: "assets/img/news/ndd-eeg.webp" },
    { title: "Review of Automated Grasp Recognition using sEMG", venue: "IEEE Trans. Instrumentation and Measurement", if: "5.6", type: "Journal", year: 2024,
      link: "https://doi.org/10.1109/TIM.2024.3497179",
      image: "assets/img/news/grasp-semg.webp" },
    { title: "Coronary Artery Disease Identification Using ECG", venue: "IEEE Access", if: "3.4", type: "Journal", year: 2024,
      link: "https://doi.org/10.1109/ACCESS.2024.3469536",
      image: "assets/img/news/cad-ecg.webp" },
    { title: "EEG-based Brain-Computer Interface Development", venue: "Research highlight", type: "Highlight", year: 2024,
      image: "assets/img/news/bci.webp" },
    { title: "Classifying Upper Limb Motor Imagery Tasks", venue: "ICARM 2024, Tokyo", type: "Conference", year: 2024,
      link: "https://doi.org/10.1109/ICARM62033.2024.10715808",
      text: "Band-power ratio, time-domain and band-power features with optimised KNN and ensemble classifiers for EEG motor-imagery classification, toward brain–robot interfaces.",
      image: "assets/img/news/motor-imagery.webp" },
  ],

  /* type: "journal" | "conference" */
  publications: [
    // ---- Journals ----
    { type: "journal", year: 2026, authors: "M. B. Maksud, S. Rahman, M. M. H. Bhuiyan, T. I. Majumder and K. N. Faisal",
      title: "Single-channel wearable EEG for ADL recognition in Healthy and Epileptic cohorts using MODWT-MRA and machine learning",
      venue: "Biomedical Signal Processing and Control, vol. 131, p. 111600, 2027", tags: ["Q1", "IF 5.7"],
      link: "https://www.sciencedirect.com/science/article/pii/S1746809426021580" },
    { type: "journal", year: 2026, authors: "S. Rahman, R. R. Sharma and K. N. Faisal",
      title: "Radar-Based Sleep Posture Transition Sensing: An Efficient Deep Learning Hierarchical Temporal Architecture Utilizing Depthwise Convolution",
      venue: "IEEE Sensors Letters (accepted)", tags: ["Q2", "IF 2.4"], link: "https://ieeexplore.ieee.org/document/11594419" },
    { type: "journal", year: 2026, authors: "K. N. Faisal, S. Sharma and R. R. Sharma",
      title: "WVD-MODWT: An Enhanced Wigner-Ville Distribution for the Automated Control of Human-Machine Interaction-based Systems",
      venue: "IEEE/CAA Journal of Automatica Sinica (accepted)", tags: ["Q1", "IF 19.2", "Rank 1/89"] },
    { type: "journal", year: 2026, authors: "S. Rahman, M. H. Omio, N. Himel, R. R. Sharma and K. N. Faisal",
      title: "Stacking Multi-Variate Time-Frequency Information: A Deep Learning Approach for IMU-MMG based Hand Gesture Recognition",
      venue: "IEEE Sensors Journal (accepted)", tags: ["Q1", "IF 4.5"], link: "https://ieeexplore.ieee.org/document/11508135" },
    { type: "journal", year: 2026, authors: "S. Rahman, S. Farhan, R. R. Sharma and K. N. Faisal",
      title: "HatSeqNet: A Sequence-based Deep Learning Model for Cross-Subject Driver Drowsiness Detection using Single-Channel EEG Signal",
      venue: "IEEE Sensors Journal", tags: ["Q1", "IF 4.5"], link: "https://doi.org/10.1109/JSEN.2026.3677604" },
    { type: "journal", year: 2026, authors: "A. Ghosh, S. Rahman, L. S. Siam and K. N. Faisal",
      title: "Improved FMCW Radar Sensing for HAR-Systems: Applying Synchroextracting Transform-Enhanced Time-Frequency Representation and Custom Anisotropic CNN",
      venue: "IEEE Sensors Letters", tags: ["Q2", "IF 2.4"], link: "https://ieeexplore.ieee.org/document/11419777" },
    { type: "journal", year: 2025, authors: "K. N. Faisal, U. Chandela and R. R. Sharma",
      title: "Two-Dimensional Successive Variational Mode Decomposition",
      venue: "IEEE Signal Processing Letters", tags: ["Q1", "IF 3.2"], link: "https://doi.org/10.1109/LSP.2025.3561632" },
    { type: "journal", year: 2025, authors: "U. Chandela, K. N. Faisal and R. R. Sharma",
      title: "Electroencephalogram-based Unified Approach for Multiple Neurodevelopmental Disorders Detection in Children Using Successive Multivariate Variational Mode Decomposition",
      venue: "IEEE Transactions on Cognitive and Developmental Systems", tags: ["Q1", "IF 5.0"], link: "https://doi.org/10.1109/TCDS.2025.3556888" },
    { type: "journal", year: 2025, authors: "S. Agarwal, S. Sharma, K. N. Faisal and R. R. Sharma",
      title: "Time-Series Forecasting Using SVMD-LSTM: A Hybrid Approach for Stock Market Prediction",
      venue: "Journal of Probability and Statistics, 2025", tags: ["IF 1.0"], link: "https://doi.org/10.1155/jpas/9464938" },
    { type: "journal", year: 2024, authors: "S. Sharma, K. N. Faisal and R. R. Sharma",
      title: "Automated Grasp Recognition using sEMG: Recent Advances, Challenges and Future Developments",
      venue: "IEEE Transactions on Instrumentation and Measurement, vol. 74, pp. 1-17, 2025", tags: ["Q1", "IF 5.6"], link: "https://doi.org/10.1109/TIM.2024.3497179" },
    { type: "journal", year: 2024, authors: "N. K., K. N. Faisal, H. S. Mir and R. R. Sharma",
      title: "Coronary Artery Disease Identification Using ECG: An Improved Energy Estimation-Based Approach",
      venue: "IEEE Access, vol. 12, pp. 147918-147928, 2024", tags: ["Q1", "IF 3.4"], link: "https://doi.org/10.1109/ACCESS.2024.3469536" },
    { type: "journal", year: 2023, authors: "K. N. Faisal, H. S. Mir and R. R. Sharma",
      title: "Human Activity Recognition From FMCW Radar Signals Utilizing Cross-Terms Free WVD",
      venue: "IEEE Internet of Things Journal, vol. 11, no. 8, pp. 14383-14394, 2024", tags: ["Q1", "IF 10.2"], link: "https://doi.org/10.1109/JIOT.2023.3344100" },
    { type: "journal", year: 2023, authors: "K. N. Faisal and R. R. Sharma",
      title: "Successive variational mode decomposition-based enhanced Wigner-Ville distribution for seismovolcanic events identification",
      venue: "Journal of Volcanology and Geothermal Research, vol. 440, p. 107847, 2023", tags: ["Q1", "IF 2.9"], link: "https://doi.org/10.1016/j.jvolgeores.2023.107847" },
    { type: "journal", year: 2023, authors: "U. Sharma, K. N. Faisal, R. R. Sharma and K. V. Arya",
      title: "Facial Landmark-Based Human Emotion Recognition Technique for Oriented Viewpoints in the Presence of Facial Attributes",
      venue: "SN Computer Science, vol. 4, no. 3, p. 273, 2023", tags: [], link: "https://doi.org/10.1007/s42979-023-01727-y" },

    // ---- Conferences ----
    { type: "conference", year: 2026, authors: "S. Rahman and K. N. Faisal",
      title: "Short-time SVMD Enhanced High-Resolution Time-Frequency Representation for ECG Signal Analysis",
      venue: "IEEE Signal Processing in Medicine and Biology Symposium (SPMB), 2026", tags: [] },
    { type: "conference", year: 2026, authors: "A. A. Mahi, M. A. Nitol, M. M. H. Bhuiyan, S. Rahman and K. N. Faisal",
      title: "FormSense: A Continuous Fatigue and Form Tracking Application for Resistance Workout Monitoring Utilizing Phase-Graded IMU Analysis",
      venue: "ICACCESS 2026", tags: [] },
    { type: "conference", year: 2026, authors: "M. M. H. Bhuiyan, F. A. Zawad, S. Rahman and K. N. Faisal",
      title: "VoxScope: A Deployment-Oriented Analysis Framework for Extreme Vocal Distortion Techniques in Heavy Metal",
      venue: "IEEE SPICSCON 2026", tags: [] },
    { type: "conference", year: 2026, authors: "N. M. A. Rasel, S. Rahman and K. N. Faisal",
      title: "Exploring Gamma-Band Filtered Features and Machine Learning for Resource-Efficient Multi-Level Cognitive Load Classification Using EEG",
      venue: "IEEE QPAIN 2026, Chattogram, Bangladesh", tags: [], award: "Best Presentation Award" },
    { type: "conference", year: 2025, authors: "S. Rahman, I. Mohtasim, S. Farhan and K. N. Faisal",
      title: "Leveraging Power Spectrum-based Features and Machine Learning for Resource-Efficient Cough Classification in Respiratory Disease Monitoring",
      venue: "IEEE SPICSCON 2025, pp. 587-591", tags: [], award: "Best Paper Award", link: "https://ieeexplore.ieee.org/abstract/document/11504221" },
    { type: "conference", year: 2025, authors: "Z. S. Simin, M. R. Islam, S. Aabira, A. Ghosh, A. Subah and K. N. Faisal",
      title: "Towards Real-Time Tea Leaf Disease Management: A Deep Learning Solution for Resource-Constrained Environments",
      venue: "IEEE WIECON-ECE 2025, pp. 468-473", tags: [], link: "https://ieeexplore.ieee.org/document/11525971" },
    { type: "conference", year: 2025, authors: "S. Sharma, K. N. Faisal and R. R. Sharma",
      title: "Placement-Invariant Hand Grasp Recognition Using Fixed Diameter sEMG Band",
      venue: "AIR '25, 7th Int. Conf. on Advances in Robotics, ACM", tags: [] },
    { type: "conference", year: 2025, authors: "P. Das, S. Rahman, S. Monem, M. A. Siam, S. Banerjee and K. N. Faisal",
      title: "Enhanced Expert Power Quality Recognition System with Optimal Feature Selection and Multi-Model Classification",
      venue: "IEEE PEEIACON 2025, Dhaka", tags: [] },
    { type: "conference", year: 2025, authors: "A. Ghosh, L. S. Siam and K. N. Faisal",
      title: "Wi-FHARNet: A CNN–BiLSTM Hybrid model for Fine-grained Human Activity Recognition utilizing Wi-Fi-based CSI Data",
      venue: "IEEE ICTP 2025, Dhaka", tags: [], link: "https://doi.org/10.1109/ICTP68765.2025.11414825" },
    { type: "conference", year: 2025, authors: "S. Rahman, S. Farhan, S. Aabira and K. N. Faisal",
      title: "GCAF-Net: An Attention-Enhanced Deep CNN Framework with Grad-CAM for Classifying Rare and Endangered Medicinal Plants in Bangladesh",
      venue: "IEEE QPAIN 2025, Saidpur, pp. 1-6", tags: [], link: "https://ieeexplore.ieee.org/abstract/document/11171960" },
    { type: "conference", year: 2024, authors: "S. Sharma, K. N. Faisal and R. R. Sharma",
      title: "Automated Power-Precision Grasp Recognition from sEMG: A Multivariate Signal Decomposition-based Approach",
      venue: "IEEE INSPECT 2024, Gwalior, India", tags: [], link: "https://ieeexplore.ieee.org/abstract/document/10896124" },
    { type: "conference", year: 2024, authors: "K. N. Faisal, P. H. Kurhe, K. S. Upadhyay and R. R. Sharma",
      title: "Upper Limb Motor Imagery Task Classification for EEG-based Brain Computer Interface Development",
      venue: "IEEE CONECCT 2024, Bangalore, India", tags: [], link: "https://doi.org/10.1109/CONECCT62155.2024.10677276" },
    { type: "conference", year: 2024, authors: "K. Gurjar, S. Agrawal, K. N. Faisal and R. R. Sharma",
      title: "Classifying EEG-based Upper Limb Motor Imagery Tasks for Brain-Robot Interface-based System Development",
      venue: "ICARM 2024, Tokyo, Japan, pp. 7-12", tags: [], link: "https://doi.org/10.1109/ICARM62033.2024.10715808" },
    { type: "conference", year: 2024, authors: "S. Agarwal, S. Sharma, K. N. Faisal and R. R. Sharma",
      title: "Induced Stress Identification Using EEG: A Framework based on MVMD and Machine Learning",
      venue: "IEEE SCEECS 2024, Bhopal, India", tags: [], link: "https://doi.org/10.1109/SCEECS61402.2024.10481868" },
    { type: "conference", year: 2023, authors: "K. N. Faisal and R. R. Sharma",
      title: "Suppression of False-terms in Wigner-Ville Distribution using Time and Frequency Windowing",
      venue: "PCEMS 2023, Nagpur, India", tags: [], award: "Best Male Student Paper Award", link: "https://doi.org/10.1109/PCEMS58491.2023.10136110" },
    { type: "conference", year: 2023, authors: "K. N. Faisal and R. R. Sharma",
      title: "Cross-terms Reduction in WVD using Sliding Window-based Variational Mode Decomposition",
      venue: "SPIN 2023, Noida, India, pp. 58-63", tags: [], link: "https://doi.org/10.1109/SPIN57001.2023.10116192" },
    { type: "conference", year: 2017, authors: "Paul, M. F. Hossain, M. S. Muktadir and K. N. Faisal",
      title: "Fabrication of a cost effective thermal evaporation system for thin film deposition",
      venue: "ICAEE 2017, Dhaka, pp. 703-706", tags: [], link: "https://doi.org/10.1109/ICAEE.2017.8255446" },
    { type: "conference", year: 2016, authors: "K. N. Faisal, M. Z. I. Sarkar, R. Sultana and M. S. Muktadir",
      title: "Security analysis of co-located and distributed MIMO interference networks with linear receivers",
      venue: "ICECTE 2016, Rajshahi", tags: [], link: "https://doi.org/10.1109/ICECTE.2016.7879579" },
    { type: "conference", year: 2015, authors: "K. N. Faisal, M. Z. I. Sarkar and R. Sultana",
      title: "Security in cellular MIMO interference networks with linear receivers",
      venue: "ICEEE 2015, Rajshahi, pp. 129-132", tags: [], link: "https://doi.org/10.1109/CEEE.2015.7428236" },
    { type: "conference", year: 2014, authors: "M. B. Uddin, M. Z. I. Sarkar, K. N. Faisal and M. M. Ali",
      title: "Performance analysis of Nakagami-m fading massive MIMO channels with linear receivers",
      venue: "ICCIT 2014, Dhaka, pp. 510-513", tags: [], link: "https://doi.org/10.1109/ICCITechn.2014.7073089" },
    { type: "conference", year: 2014, authors: "R. Sultana, M. Z. I. Sarkar, K. N. Faisal, J. E. Giti and F. R. S. Ahmed",
      title: "Enhancing wireless capacity in heterogeneous networks with interference power",
      venue: "ICCIT 2014, Dhaka, pp. 458-461", tags: [], link: "https://doi.org/10.1109/ICCITechn.2014.7073076" },
  ],

  team: {
    mentors: [
      { name: "Dr. Kazi Newaj Faisal", role: "Founding Director & Principal Investigator",
        lines: ["Associate Professor, EECE Dept.", "Military Institute of Science and Technology (MIST), Bangladesh"],
        email: "newajfaisal@gmail.com", profile: "director",
        photo: "assets/img/team/kazi-newaj-faisal.webp",
        links: ["https://scholar.google.com/citations?user=WYuCPWcAAAAJ&hl=en", "https://www.linkedin.com/in/newajfaisal/", "https://www.researchgate.net/profile/Kazi-Newaj-Faisal", "https://orcid.org/0000-0003-0546-4536"] },
      /* Hidden for now (owner request); remove the comment markers to restore.
      { name: "Dr. Rishi Raj Sharma", role: "Co-Principal Investigator",
        lines: ["Professor, Department of Electronics Engineering", "Defence Institute of Advanced Technology (DIAT), Pune, India"],
        email: "rsharma@diat.ac.in", profile: "https://www.sensigi.com/chief-researcher",
        photo: "assets/img/team/rishi-raj-sharma.webp",
        links: ["https://scholar.google.com/citations?user=pcdcpHcAAAAJ&hl=en", "https://www.linkedin.com/in/rishi-raj-sharma-96b906a4/", "https://orcid.org/0000-0001-6835-003X"] }, */
    ],
    groups: [
      { title: "Research Assistant", people: [
        { name: "Sadman Rahman", now: "Research Assistant, Co-Founder · M.Sc. EEE (BUET) · B.Sc. EEE (MIST)",
          photo: "assets/img/team/sadman-rahman.webp",
          links: ["https://www.linkedin.com/in/sadman-rahman-2412b0339/", "https://www.facebook.com/sadman.rahman.950583", "https://sdmrnwashere.github.io/", "https://scholar.google.com/citations?user=nHt79bkAAAAJ&hl=en"] },
      ]},
      { title: "Graduate Lab Members", people: [
        { name: "Irtiza Mohtasim", now: "Assistant Engineer @ Grameen Shakti", photo: "assets/img/team/irtiza-mohtasim.webp",
          links: ["https://www.linkedin.com/in/irtiza-mohtasim-400401248/", "https://www.facebook.com/irtizamohtasim.cim/"] },
        { name: "Zakia Sultana Simin", now: "Lecturer @ Prime University · M.Sc. (IICT) @ BUET, ongoing", photo: "assets/img/team/zakia-sultana-simin.webp",
          links: ["https://www.linkedin.com/in/zakia-sultana-simin-a3b8b2241/", "https://www.facebook.com/zakiasultanasimin", "https://www.researchgate.net/profile/Zakia-Simin"] },
        { name: "Nur Md Atiquzzaman", photo: "assets/img/team/nur-md-atiquzzaman.webp",
          links: ["https://www.linkedin.com/in/nur-md-atiquzzaman-rasel-273b1720a"] },
        { name: "Arnob Ghosh", photo: "assets/img/team/arnob-ghosh.webp",
          links: ["https://www.facebook.com/arnob.ghosh.16"] },
        { name: "Siam Rahman", now: "M.Sc. (EEE) student @ BUET", photo: "assets/img/team/siam-rahman.webp",
          links: ["https://www.linkedin.com/in/siam-rahman-540527316/", "https://scholar.google.com/citations?user=DiUZBuoAAAAJ&hl=en"] },
        { name: "Pretom Das", now: "M.Sc. (EEE) student @ BUET · Research Assistant @ MIST", photo: "assets/img/team/pretom-das.webp",
          links: ["https://pretomdas.vercel.app/", "https://scholar.google.com/citations?user=cOyG-1MAAAAJ&hl=en"] },
      ]},
      /* Undergraduates in rows by MIST level (academic year): Level 4, then 3, then 2.
         No sub-headings; each card carries a small level badge. Each row is in join order. */
      { title: "Undergraduate Lab Members", rows: [
      { level: 4, people: [
        { name: "Mehedi Omio", photo: "assets/img/team/mehedi-omio.webp",
          links: ["https://www.linkedin.com/in/mdmehedihasanbhuiyan/", "https://scholar.google.com/citations?hl=en&user=FedkYBAAAAAJ", "http://www.researchgate.net/profile/Md-Mehedi-Hasan-Bhuiyan-2", "https://www.facebook.com/mehediamio00"] },
        { name: "Mahdia Binte Maksud", photo: "assets/img/team/mahdia-binte-maksud.webp",
          links: ["https://www.linkedin.com/in/mahdia-binte-maksud-b50575365"] },
        { name: "Marjuka Sabira", photo: "assets/img/team/marjuka-sabira.webp",
          links: ["http://www.linkedin.com/in/marjuka-sabira-5994743a3", "https://scholar.google.com/citations?hl=en&user=_rFcpnYAAAAJ"] },
        { name: "Farhan Mohib Hemal", photo: "assets/img/team/farhan-mohib-hemal.webp",
          links: ["https://www.linkedin.com/in/md-farhan-mohib-hemal-467589258/", "https://scholar.google.com/citations?hl=en&user=3IPiHKEAAAAJ", "https://www.researchgate.net/profile/Md-Farhan-Mohib-Hemal"] },
        { name: "Naimul Haque", photo: "assets/img/team/naimul-haque.webp",
          links: ["https://www.linkedin.com/in/naimul-hoque-4361692a2", "https://scholar.google.com/citations?hl=en&user=pkLA46MAAAAJ", "https://www.researchgate.net/profile/Naimul-Hoque-5"] },
        { name: "Nazmul Islam Zisan", photo: "assets/img/team/nazmul-islam-zisan.webp",
          links: ["http://www.linkedin.com/in/nazmul-islam-zisan-eee-mist", "https://scholar.google.com/citations?user=nu_AlyIAAAAJ&hl=en", "https://www.researchgate.net/profile/Nazmul-Zisan-2"] },
        { name: "Sabbir Ahmed Khan", photo: "assets/img/team/sabbir-ahmed-khan.webp",
          links: ["http://www.linkedin.com/in/sabbir-ahmed-khan-78a379283", "https://www.researchgate.net/profile/Sabbir-Ahmed-Khan"] },
      ]},
      { level: 3, people: [
        { name: "Jannatul Naeum Taha", photo: "assets/img/team/jannatul-naeum-taha.webp",
          links: ["https://www.linkedin.com/in/jannatul-naeum-41b906337", "https://scholar.google.com/citations?user=DGIVuWcAAAAJ"] },
        { name: "Tasmima Yasmin Puspita", photo: "assets/img/team/tasmima-yasmin-puspita.webp",
          links: ["https://www.linkedin.com/in/tasmima-yasmin-puspita-4026b5444", "https://www.researchgate.net/profile/Tasmima-Puspita"] },
        { name: "Yeasin Nobi Muhi", photo: "assets/img/team/yeasin-nobi-muhi.webp",
          links: ["https://www.linkedin.com/in/yeasin-nobi-muhi-a9579b44a", "https://www.researchgate.net/profile/Yeasin-Muhi"] },
        { name: "Tasnia Islam Mitra", photo: "assets/img/team/tasnia-islam-mitra.webp",
          links: ["https://www.linkedin.com/in/tasnia-islam-mitra-b9753a248"] },
        { name: "Syeda Iffat Jahan Tarin", photo: "assets/img/team/syeda-iffat-jahan-tarin.webp",
          links: ["https://www.linkedin.com/in/syeda-iffat-jahan-tarin-baa1a72bb", "https://www.researchgate.net/profile/Syeda-Tarin"] },
        { name: "Samia Rahman", photo: "assets/img/team/samia-rahman.webp",
          links: ["https://www.linkedin.com/in/samia-rahman-89aa5b33a", "https://scholar.google.com/citations?user=0THxLhMAAAAJ", "https://www.researchgate.net/profile/Samia-Rahman-30"] },
        { name: "Md. Rafiul Islam Talukder", photo: "assets/img/team/rafiul-islam-talukder.webp",
          links: ["https://scholar.google.com/citations?user=xcKfK9sAAAAJ"] },
        { name: "Tahiya Iffat Majumder", photo: "assets/img/team/tahiya-iffat-majumder.webp",
          links: ["https://www.linkedin.com/in/tahiyamajumder", "https://scholar.google.com/citations?user=ku8NozUAAAAJ", "https://www.researchgate.net/profile/Tahiya-Majumder"] },
      ]},
      { level: 2, people: [
        { name: "Mayesha Muntaha Rahman", photo: "assets/img/team/mayesha-muntaha-rahman.webp",
          links: ["https://www.linkedin.com/in/mayesha-muntaha-rahman-688104310", "https://scholar.google.com/citations?user=msgm4IYAAAAJ", "https://www.researchgate.net/profile/Mayesha-Rahman-4"] },
        { name: "Rafid Mahmud Spandan", photo: "assets/img/team/rafid-mahmud-spandan.webp",
          links: ["https://www.linkedin.com/in/rafid-mahmud-spandan-890a6a384", "https://scholar.google.com/citations?user=c5J3gagAAAAJ", "https://www.researchgate.net/profile/Rafid-Spandan"] },
        { name: "Puja Roy Payel", photo: "assets/img/team/puja-roy-payel.webp",
          links: ["https://www.linkedin.com/in/puja-roy-401536444", "https://scholar.google.com/citations?user=3ormYfwAAAAJ", "https://www.researchgate.net/profile/Puja-Roy-12"] },
        { name: "Labib Muhtadi Khan Choudhury", photo: "assets/img/team/labib-muhtadi-khan-choudhury.webp",
          links: ["https://www.linkedin.com/in/labib-muhtadi", "https://scholar.google.com/citations?user=SrvOlGwAAAAJ", "https://www.researchgate.net/profile/Labib-Choudhury"] },
        { name: "Md. Shahriar Imran Saad", photo: "assets/img/team/shahriar-imran-saad.webp",
          links: ["https://www.linkedin.com/in/shahriar-imran-saad-587194274", "https://scholar.google.com/citations?user=BT9eeIEAAAAJ"] },
        { name: "Sahiba Hussain Aurpa", photo: "assets/img/team/sahiba-hussain-aurpa.webp",
          links: ["https://scholar.google.com/citations?user=kUBwNR0AAAAJ"] },
        { name: "Ayesha Islam", photo: "assets/img/team/ayesha-islam.webp",
          links: ["https://www.linkedin.com/in/ayesha-islam-295377411", "https://scholar.google.com/citations?user=myNcgpkAAAAJ", "https://www.researchgate.net/profile/Ayesha-Islam-15"] },
        { name: "Jarin Subah Tanha", photo: "assets/img/team/jarin-subah-tanha.webp",
          links: ["https://www.linkedin.com/in/jarin-subah-tanha-94b472451", "https://scholar.google.com/citations?user=oUJTYeUAAAAJ", "https://www.researchgate.net/profile/Jarin-Tanha-2"] },
      ]},
      ]},
      { title: "Alumni", people: [
        { name: "Saiba Aabira", photo: "assets/img/team/saiba-aabira.webp",
          links: ["https://www.linkedin.com/in/saiba-aabira-99a3aa314/", "https://www.facebook.com/saiba.aabira", "https://scholar.google.com/citations?user=d-qiK9AAAAAJ&hl=en"] },
        { name: "Arshean Subah", now: "M.Sc. (EEE) student @ BUET", photo: "assets/img/team/arshean-subah.webp",
          links: ["https://www.linkedin.com/in/arshean-subah-34587825b/", "https://www.facebook.com/arshean"] },
        { name: "Md. Raisul Islam", photo: "assets/img/team/raisul-islam-ratul.webp", now: "Management Trainee Officer @ EPIC Group",
          links: ["https://www.linkedin.com/in/raisulislamratul/", "https://www.facebook.com/thinking.sparrow"] },
        { name: "Anindya Tirtha", photo: "assets/img/team/anindya-tirtha.webp",
          links: ["https://www.linkedin.com/in/anindya-chanda-tirtha-705a87417", "https://www.facebook.com/apc.tirtha"] },
        { name: "Md. Raisul Islam", photo: "assets/img/team/raisul-islam-romel.webp", now: "Trainee Engineer @ Fiber@Home",
          links: ["https://www.linkedin.com/in/raisul-romel517/", "https://www.facebook.com/raisulislamromel", "https://www.researchgate.net/profile/Md-Raisul-Islam-9", "https://scholar.google.com/citations?user=VLt0c44AAAAJ&hl", "https://raisul-portfolio.vercel.app/./"] },
        { name: "Saquib Farhan", now: "Engineer, Trainee Officer (R&D) @ Neural Semiconductor", photo: "assets/img/team/saquib-farhan.webp",
          links: ["https://www.linkedin.com/in/farhan-saquib-8b4350301/", "https://scholar.google.com/citations?user=qL_1N9IAAAAJ&hl=en", "https://orcid.org/0009-0002-2821-4337"] },
        { name: "Nasiruddin Himel", photo: "assets/img/team/nasiruddin-himel.webp",
          links: ["https://www.linkedin.com/in/nasiruddin-mahmud", "https://www.facebook.com/share/1AVxB6bvb5/", "https://www.researchgate.net/profile/Nasiruddin-Mahmud-Himel"] },
      ]},
    ],
  },

  venues: ["IEEE Sensors Journal", "IEEE Internet of Things Journal", "IEEE/CAA J. Automatica Sinica", "IEEE Signal Processing Letters",
    "IEEE Trans. Instrumentation & Measurement", "IEEE Trans. Cognitive & Developmental Systems", "Biomedical Signal Processing & Control",
    "IEEE Access", "IEEE Sensors Letters", "J. Volcanology & Geothermal Research"],
};

/* ── v8 additions ───────────────────────────────────────────────────────────
   Extra detail shown on the site. Summaries are short plain-language lines
   written from each paper's title and venue: review and edit them freely. */
(() => {
  const D = window.INSIA;

  /* Recent Work cards: authors + one-line summary (matched by news title) */
  const X = {
    "High-Resolution Time-Frequency Representation for ECG Signal Analysis": { authors: "S. Rahman and K. N. Faisal",
      summary: "Short-time SVMD sharpens the time–frequency picture of ECG signals, making subtle cardiac features easier to read." },
    "Single-Channel Wearable EEG for ADL Recognition in Healthy and Epileptic Patients": { authors: "M. B. Maksud, S. Rahman, M. M. H. Bhuiyan, T. I. Majumder and K. N. Faisal",
      summary: "Recognises everyday activities from one wearable EEG channel, in healthy people and patients with epilepsy, using MODWT-MRA features." },
    "Radar-Based Sleep Posture Transition Sensing Utilizing Depthwise Convolution": { authors: "S. Rahman, R. R. Sharma and K. N. Faisal",
      summary: "A lightweight depthwise-convolution network that detects changes in sleeping posture from radar, with no cameras or wearables." },
    "IMU–MMG-Based Hand Gesture Recognition": { authors: "S. Rahman, M. H. Omio, N. Himel, R. R. Sharma and K. N. Faisal",
      summary: "Stacks multivariate time–frequency maps from IMU and MMG sensors so a deep network can recognise hand gestures." },
    "Cross-Subject Driver Drowsiness Detection using Single-Channel EEG Signal": { authors: "S. Rahman, S. Farhan, R. R. Sharma and K. N. Faisal",
      summary: "HatSeqNet, a sequence model that detects driver drowsiness from a single EEG channel and generalises across people." },
    "Synchroextracting Transform-Enhanced Improved FMCW Radar Sensing for HAR Systems": { authors: "A. Ghosh, S. Rahman, L. S. Siam and K. N. Faisal",
      summary: "Synchroextracting-transform time–frequency maps and a custom anisotropic CNN improve activity recognition from FMCW radar." },
    "Two-Dimensional Successive Variational Mode Decomposition": { authors: "K. N. Faisal, U. Chandela and R. R. Sharma",
      summary: "Extends successive variational mode decomposition to images, splitting a picture into its intrinsic modes." },
    "EEG-based Unified & Multiple Neurodevelopmental Disorders Detection in Children": { authors: "U. Chandela, K. N. Faisal and R. R. Sharma",
      summary: "One EEG framework that screens children for several neurodevelopmental disorders at once, using successive multivariate VMD." },
    "Review of Automated Grasp Recognition using sEMG": { authors: "S. Sharma, K. N. Faisal and R. R. Sharma",
      summary: "A review of grasp recognition from surface EMG: recent advances, open challenges and future directions." },
    "Coronary Artery Disease Identification Using ECG": { authors: "N. K., K. N. Faisal, H. S. Mir and R. R. Sharma",
      summary: "Identifies coronary artery disease from ECG with an improved energy-estimation approach." },
    "EEG-based Brain-Computer Interface Development": { authors: "INSIA Lab",
      summary: "The lab's EEG brain–computer-interface pipeline, from signal acquisition and feature extraction to device control." },
    "Classifying Upper Limb Motor Imagery Tasks": { authors: "K. Gurjar, S. Agrawal, K. N. Faisal and R. R. Sharma" },
  };
  D.news.forEach(n => Object.assign(n, X[n.title] || {}));

  /* Mentor bios (Team page feature blocks) */
  const bios = {
    "Dr. Kazi Newaj Faisal": "Associate Professor in the Department of EECE at the Military Institute of Science and Technology (MIST) and founding director of the INSIA Lab. He received his Ph.D. from the Defence Institute of Advanced Technology (DIAT), Pune, India, on enhanced Wigner–Ville distributions for multi-component non-stationary signals, and his M.Sc. and B.Sc. in EEE from RUET. His research covers time–frequency analysis, non-stationary signal processing, radar and biomedical signals, and brain–computer interfaces. He holds a Ministry of Science and Technology research grant (2025) and received the Best Student Paper Award at IEEE SPICSCON 2025 and the Best Male Student Paper Award at PCEMS 2023.",
    "Dr. Rishi Raj Sharma": "Professor in the Department of Electronics Engineering at the Defence Institute of Advanced Technology (DIAT), Pune, India, where he leads the Sensors and Signal Intelligence (SenSigI) Lab. He co-supervises INSIA's work on time–frequency analysis, signal decomposition and biomedical signal processing.",
  };
  D.team.mentors.forEach(m => { m.bio = bios[m.name] || ""; });

  /* Role line on each member card (blue, under the name) */
  const roles = { "Research Assistant": "Research Assistant", "Graduate Lab Members": "Graduate Researcher",
                  "Undergraduate Lab Members": "Undergraduate Researcher", "Alumni": "Alumni" };
  D.team.groups.forEach(g => (g.rows ? g.rows.flatMap(r => r.people) : g.people).forEach(p => { p.role = p.role || roles[g.title] || ""; }));
  /* Alumni: add `now: "PhD student @ …"` to a person in team.groups above to show where they went next. */

  /* Achievements (Team page): newest first; `people` get the credit */
  D.achievements = [
    { year: 2026, award: "Research Grant", where: "MIST Research Grant Committee: Development of a privacy-preserving handheld fingerprint-based automated attendance system for MIST and higher-education institutions of Bangladesh", people: "K. N. Faisal (PI)" },
    { year: 2026, award: "Best Presentation Award", where: "IEEE QPAIN 2026, Chattogram", people: "N. M. A. Rasel, S. Rahman, K. N. Faisal" },
    { year: 2025, award: "Best Paper Award", where: "IEEE SPICSCON 2025, Rajshahi", people: "S. Rahman, I. Mohtasim, S. Farhan, K. N. Faisal" },
    { year: 2025, award: "Research Grant", where: "Ministry of Science and Technology, Bangladesh: smartphone-based distracted-walking detection", people: "K. N. Faisal (PI)" },
    { year: 2023, award: "Best Male Student Paper Award", where: "PCEMS 2023, VNIT Nagpur", people: "K. N. Faisal" },
  ];
})();

/* ── v9: Research page data ─────────────────────────────────────────────────
   Which research direction(s) each work belongs to (keys = direction glyphs:
   tf theory · radar sensing · ecg biomedical · hmi interaction · grid vision),
   plus a figure and a Publications search term per direction. */
(() => {
  const D = window.INSIA;
  const areaOf = {
    "High-Resolution Time-Frequency Representation for ECG Signal Analysis": ["tf", "ecg"],
    "Single-Channel Wearable EEG for ADL Recognition in Healthy and Epileptic Patients": ["ecg", "radar"],
    "Radar-Based Sleep Posture Transition Sensing Utilizing Depthwise Convolution": ["radar"],
    "IMU–MMG-Based Hand Gesture Recognition": ["hmi", "radar"],
    "Cross-Subject Driver Drowsiness Detection using Single-Channel EEG Signal": ["ecg", "hmi"],
    "Synchroextracting Transform-Enhanced Improved FMCW Radar Sensing for HAR Systems": ["radar", "tf"],
    "Two-Dimensional Successive Variational Mode Decomposition": ["tf", "grid"],
    "EEG-based Unified & Multiple Neurodevelopmental Disorders Detection in Children": ["ecg"],
    "Review of Automated Grasp Recognition using sEMG": ["hmi"],
    "Coronary Artery Disease Identification Using ECG": ["ecg"],
    "EEG-based Brain-Computer Interface Development": ["hmi", "ecg"],
    "Classifying Upper Limb Motor Imagery Tasks": ["hmi"],
  };
  D.news.forEach(n => { n.areas = areaOf[n.title] || []; });
  const extra = {
    tf:    { image: "assets/img/news/ecg-tfr.webp",     query: "time-frequency" },
    radar: { image: "assets/img/news/radar-sleep.webp", query: "radar" },
    ecg:   { image: "assets/img/news/cad-ecg.webp",     query: "EEG" },
    hmi:   { image: "assets/img/news/bci.webp",         query: "sEMG" },
    grid:  { image: "assets/img/news/2d-svmd.webp",     query: "image" },
  };
  D.directions.forEach(d => Object.assign(d, extra[d.glyph] || {}));
})();
