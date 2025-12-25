
import { Syllabus, Difficulty, Resource } from './types';

// Mock data for Class 10 and Class 12
// Helper to generate subjects for a class
const getSubjects = (level: number, type: 'CBSE' | 'State') => {
  const isState = type === 'State';
  const prefix = isState ? 'st' : 'cb';

  const commonIter = [
    { id: `eng-${level}`, name: 'English', isManual: true, chapters: [] },
    { id: `kan-${level}`, name: 'Kannada', isManual: true, chapters: [] },
    { id: `hin-${level}`, name: 'Hindi', isManual: true, chapters: [] },
    { id: `pe-${level}`, name: 'Physical Education', isManual: true, chapters: [] }
  ];

  if (level === 12) {
    return [
      {
        id: `phy-${level}`,
        name: 'Physics',
        chapters: [
          { id: `p1-${level}`, name: 'Electric Charges and Fields', difficulty: Difficulty.MEDIUM, topics: [{ id: `tp1-${level}`, name: 'Coulomb’s Law', estimatedHours: 5 }] },
          { id: `p2-${level}`, name: 'Electrostatic Potential and Capacitance', difficulty: Difficulty.HARD, topics: [{ id: `tp2-${level}`, name: 'Capacitors', estimatedHours: 6 }] },
          { id: `p3-${level}`, name: 'Current Electricity', difficulty: Difficulty.HARD, topics: [{ id: `tp3-${level}`, name: 'Ohm’s Law & Kirchhoff’s Laws', estimatedHours: 7 }] },
          { id: `p4-${level}`, name: 'Moving Charges and Magnetism', difficulty: Difficulty.HARD, topics: [{ id: `tp4-${level}`, name: 'Biot-Savart Law', estimatedHours: 6 }] },
          { id: `p5-${level}`, name: 'Magnetism and Matter', difficulty: Difficulty.MEDIUM, topics: [{ id: `tp5-${level}`, name: 'Magnetic Properties', estimatedHours: 4 }] },
          { id: `p6-${level}`, name: 'Electromagnetic Induction', difficulty: Difficulty.MEDIUM, topics: [{ id: `tp6-${level}`, name: 'Faraday’s Law', estimatedHours: 5 }] },
          { id: `p7-${level}`, name: 'Alternating Current', difficulty: Difficulty.HARD, topics: [{ id: `tp7-${level}`, name: 'LCR Circuits', estimatedHours: 6 }] },
          { id: `p8-${level}`, name: 'Electromagnetic Waves', difficulty: Difficulty.EASY, topics: [{ id: `tp8-${level}`, name: 'EM Spectrum', estimatedHours: 3 }] },
          { id: `p9-${level}`, name: 'Ray Optics and Optical Instruments', difficulty: Difficulty.HARD, topics: [{ id: `tp9-${level}`, name: 'Lens Maker’s Formula', estimatedHours: 8 }] },
          { id: `p10-${level}`, name: 'Wave Optics', difficulty: Difficulty.MEDIUM, topics: [{ id: `tp10-${level}`, name: 'Young’s Double Slit Experiment', estimatedHours: 6 }] },
          { id: `p11-${level}`, name: 'Dual Nature of Radiation and Matter', difficulty: Difficulty.MEDIUM, topics: [{ id: `tp11-${level}`, name: 'Photoelectric Effect', estimatedHours: 5 }] },
          { id: `p12-${level}`, name: 'Atoms', difficulty: Difficulty.MEDIUM, topics: [{ id: `tp12-${level}`, name: 'Bohr’s Model', estimatedHours: 4 }] },
          { id: `p13-${level}`, name: 'Nuclei', difficulty: Difficulty.MEDIUM, topics: [{ id: `tp13-${level}`, name: 'Radioactivity', estimatedHours: 4 }] },
          { id: `p14-${level}`, name: 'Semiconductor Electronics', difficulty: Difficulty.HARD, topics: [{ id: `tp14-${level}`, name: 'PN Junction Diode', estimatedHours: 6 }] }
        ]
      },
      {
        id: `che-${level}`,
        name: 'Chemistry',
        chapters: [
          { id: `c1-${level}`, name: 'Solutions', difficulty: Difficulty.MEDIUM, topics: [{ id: `tc1-${level}`, name: 'Colligative Properties', estimatedHours: 5 }] },
          { id: `c2-${level}`, name: 'Electrochemistry', difficulty: Difficulty.HARD, topics: [{ id: `tc2-${level}`, name: 'Nernst Equation', estimatedHours: 6 }] },
          { id: `c3-${level}`, name: 'Chemical Kinetics', difficulty: Difficulty.MEDIUM, topics: [{ id: `tc3-${level}`, name: 'Rate Law', estimatedHours: 5 }] },
          { id: `c4-${level}`, name: 'd and f Block Elements', difficulty: Difficulty.MEDIUM, topics: [{ id: `tc4-${level}`, name: 'Lanthanoids', estimatedHours: 5 }] },
          { id: `c5-${level}`, name: 'Coordination Compounds', difficulty: Difficulty.HARD, topics: [{ id: `tc5-${level}`, name: 'VBT & CFT', estimatedHours: 6 }] },
          { id: `c6-${level}`, name: 'Haloalkanes and Haloarenes', difficulty: Difficulty.MEDIUM, topics: [{ id: `tc6-${level}`, name: 'SN1 & SN2 Mechanisms', estimatedHours: 6 }] },
          { id: `c7-${level}`, name: 'Alcohols, Phenols and Ethers', difficulty: Difficulty.MEDIUM, topics: [{ id: `tc7-${level}`, name: 'Dehydration of Alcohols', estimatedHours: 6 }] },
          { id: `c8-${level}`, name: 'Aldehydes, Ketones and Carboxylic Acids', difficulty: Difficulty.HARD, topics: [{ id: `tc8-${level}`, name: 'Aldol Condensation', estimatedHours: 7 }] },
          { id: `c9-${level}`, name: 'Amines', difficulty: Difficulty.MEDIUM, topics: [{ id: `tc9-${level}`, name: 'Diazonium Salts', estimatedHours: 5 }] },
          { id: `c10-${level}`, name: 'Biomolecules', difficulty: Difficulty.EASY, topics: [{ id: `tc10-${level}`, name: 'Proteins & DNA', estimatedHours: 4 }] }
        ]
      },
      {
        id: `mat-${level}`,
        name: 'Mathematics',
        chapters: [
          { id: `m1-${level}`, name: 'Relations and Functions', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm1-${level}`, name: 'Types of Relations', estimatedHours: 5 }] },
          { id: `m2-${level}`, name: 'Inverse Trigonometric Functions', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm2-${level}`, name: 'Principal Values', estimatedHours: 4 }] },
          { id: `m3-${level}`, name: 'Matrices', difficulty: Difficulty.EASY, topics: [{ id: `tm3-${level}`, name: 'Matrix Multiplication', estimatedHours: 4 }] },
          { id: `m4-${level}`, name: 'Determinants', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm4-${level}`, name: 'Properties of Determinants', estimatedHours: 5 }] },
          { id: `m5-${level}`, name: 'Continuity and Differentiability', difficulty: Difficulty.HARD, topics: [{ id: `tm5-${level}`, name: 'Chain Rule', estimatedHours: 7 }] },
          { id: `m6-${level}`, name: 'Applications of Derivatives', difficulty: Difficulty.HARD, topics: [{ id: `tm6-${level}`, name: 'Maxima and Minima', estimatedHours: 7 }] },
          { id: `m7-${level}`, name: 'Integrals', difficulty: Difficulty.HARD, topics: [{ id: `tm7-${level}`, name: 'Integration by Parts', estimatedHours: 8 }] },
          { id: `m8-${level}`, name: 'Applications of the Integrals', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm8-${level}`, name: 'Area under Curves', estimatedHours: 5 }] },
          { id: `m9-${level}`, name: 'Differential Equations', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm9-${level}`, name: 'Homogeneous Equations', estimatedHours: 6 }] },
          { id: `m10-${level}`, name: 'Vectors', difficulty: Difficulty.EASY, topics: [{ id: `tm10-${level}`, name: 'Dot & Cross Product', estimatedHours: 5 }] },
          { id: `m11-${level}`, name: 'Three-dimensional Geometry', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm11-${level}`, name: 'Shortest Distance', estimatedHours: 6 }] },
          { id: `m12-${level}`, name: 'Linear Programming', difficulty: Difficulty.EASY, topics: [{ id: `tm12-${level}`, name: 'Optimization', estimatedHours: 3 }] },
          { id: `m13-${level}`, name: 'Probability', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm13-${level}`, name: 'Bayes’ Theorem', estimatedHours: 6 }] }
        ]
      },
      {
        id: `bio-${level}`,
        name: 'Biology',
        chapters: [
          { id: `b1-${level}`, name: 'Sexual Reproduction in Flowering Plants', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb1-${level}`, name: 'Double Fertilization', estimatedHours: 5 }] },
          { id: `b2-${level}`, name: 'Human Reproduction', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb2-${level}`, name: 'Menstrual Cycle', estimatedHours: 5 }] },
          { id: `b3-${level}`, name: 'Reproductive Health', difficulty: Difficulty.EASY, topics: [{ id: `tb3-${level}`, name: 'Contraception', estimatedHours: 3 }] },
          { id: `b4-${level}`, name: 'Principles of Inheritance and Variation', difficulty: Difficulty.HARD, topics: [{ id: `tb4-${level}`, name: 'Mendelian Genetics', estimatedHours: 7 }] },
          { id: `b5-${level}`, name: 'Molecular Basis of Inheritance', difficulty: Difficulty.HARD, topics: [{ id: `tb5-${level}`, name: 'DNA Replication', estimatedHours: 7 }] },
          { id: `b6-${level}`, name: 'Evolution', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb6-${level}`, name: 'Natural Selection', estimatedHours: 5 }] },
          { id: `b7-${level}`, name: 'Human Health and Diseases', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb7-${level}`, name: 'Immunity', estimatedHours: 5 }] },
          { id: `b8-${level}`, name: 'Microbes in Human Welfare', difficulty: Difficulty.EASY, topics: [{ id: `tb8-${level}`, name: 'Sewage Treatment', estimatedHours: 3 }] },
          { id: `b9-${level}`, name: 'Biotechnology - Principles and Processes', difficulty: Difficulty.HARD, topics: [{ id: `tb9-${level}`, name: 'rDNA Technology', estimatedHours: 6 }] },
          { id: `b10-${level}`, name: 'Biotechnology and its Applications', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb10-${level}`, name: 'Bt Cotton', estimatedHours: 4 }] },
          { id: `b11-${level}`, name: 'Organisms and Populations', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb11-${level}`, name: 'Population Interactions', estimatedHours: 5 }] },
          { id: `b12-${level}`, name: 'Ecosystem', difficulty: Difficulty.EASY, topics: [{ id: `tb12-${level}`, name: 'Energy Flow', estimatedHours: 4 }] },
          { id: `b13-${level}`, name: 'Biodiversity and its Conservation', difficulty: Difficulty.EASY, topics: [{ id: `tb13-${level}`, name: 'In-situ Conservation', estimatedHours: 3 }] }
        ]
      },
      ...commonIter
    ];
  }

  if (level === 11) {
    return [
      {
        id: `phy-${level}`,
        name: 'Physics',
        chapters: [
          { id: `p1-${level}`, name: 'Units and Measurements', difficulty: Difficulty.EASY, topics: [{ id: `tp1-${level}`, name: 'SI Units & Dimensions', estimatedHours: 4 }] },
          { id: `p2-${level}`, name: 'Motion in a Straight Line', difficulty: Difficulty.MEDIUM, topics: [{ id: `tp2-${level}`, name: 'Kinematic Equations', estimatedHours: 5 }] },
          { id: `p3-${level}`, name: 'Motion in a Plane', difficulty: Difficulty.MEDIUM, topics: [{ id: `tp3-${level}`, name: 'Projectile Motion', estimatedHours: 5 }] },
          { id: `p4-${level}`, name: 'Laws of Motion', difficulty: Difficulty.HARD, topics: [{ id: `tp4-${level}`, name: 'Newton’s Laws & Friction', estimatedHours: 6 }] },
          { id: `p5-${level}`, name: 'Work, Energy and Power', difficulty: Difficulty.MEDIUM, topics: [{ id: `tp5-${level}`, name: 'Work-Energy Theorem', estimatedHours: 5 }] },
          { id: `p6-${level}`, name: 'System of Particles and Rotational Motion', difficulty: Difficulty.HARD, topics: [{ id: `tp6-${level}`, name: 'Moment of Inertia', estimatedHours: 7 }] },
          { id: `p7-${level}`, name: 'Gravitation', difficulty: Difficulty.MEDIUM, topics: [{ id: `tp7-${level}`, name: 'Kepler’s Laws', estimatedHours: 4 }] },
          { id: `p8-${level}`, name: 'Mechanical Properties of Solids', difficulty: Difficulty.EASY, topics: [{ id: `tp8-${level}`, name: 'Stress & Strain', estimatedHours: 3 }] },
          { id: `p9-${level}`, name: 'Mechanical Properties of Fluids', difficulty: Difficulty.MEDIUM, topics: [{ id: `tp9-${level}`, name: 'Bernoulli’s Principle', estimatedHours: 4 }] },
          { id: `p10-${level}`, name: 'Thermal Properties of Matter', difficulty: Difficulty.MEDIUM, topics: [{ id: `tp10-${level}`, name: 'Calorimetry', estimatedHours: 4 }] },
          { id: `p11-${level}`, name: 'Thermodynamics', difficulty: Difficulty.HARD, topics: [{ id: `tp11-${level}`, name: 'Laws of Thermodynamics', estimatedHours: 5 }] },
          { id: `p12-${level}`, name: 'Kinetic Theory', difficulty: Difficulty.MEDIUM, topics: [{ id: `tp12-${level}`, name: 'Ideal Gas Equation', estimatedHours: 3 }] },
          { id: `p13-${level}`, name: 'Oscillations', difficulty: Difficulty.HARD, topics: [{ id: `tp13-${level}`, name: 'SHM & Pendulums', estimatedHours: 5 }] },
          { id: `p14-${level}`, name: 'Waves', difficulty: Difficulty.MEDIUM, topics: [{ id: `tp14-${level}`, name: 'Doppler Effect', estimatedHours: 4 }] }
        ]
      },
      {
        id: `che-${level}`,
        name: 'Chemistry',
        chapters: [
          { id: `c1-${level}`, name: 'Some Basic Concepts of Chemistry', difficulty: Difficulty.MEDIUM, topics: [{ id: `tc1-${level}`, name: 'Mole Concept', estimatedHours: 5 }] },
          { id: `c2-${level}`, name: 'Structure of Atom', difficulty: Difficulty.HARD, topics: [{ id: `tc2-${level}`, name: 'Quantum Mechanical Model', estimatedHours: 6 }] },
          { id: `c3-${level}`, name: 'Classification of Elements and Periodicity in Properties', difficulty: Difficulty.MEDIUM, topics: [{ id: `tc3-${level}`, name: 'Periodic Trends', estimatedHours: 4 }] },
          { id: `c4-${level}`, name: 'Chemical Bonding and Molecular Structure', difficulty: Difficulty.HARD, topics: [{ id: `tc4-${level}`, name: 'VSEPR Theory', estimatedHours: 7 }] },
          { id: `c5-${level}`, name: 'Thermodynamics', difficulty: Difficulty.HARD, topics: [{ id: `tc5-${level}`, name: 'Hess’s Law', estimatedHours: 6 }] },
          { id: `c6-${level}`, name: 'Equilibrium', difficulty: Difficulty.HARD, topics: [{ id: `tc6-${level}`, name: 'Le Chatelier’s Principle', estimatedHours: 7 }] },
          { id: `c7-${level}`, name: 'Redox Reactions', difficulty: Difficulty.MEDIUM, topics: [{ id: `tc7-${level}`, name: 'Balancing Redox Reactions', estimatedHours: 4 }] },
          { id: `c8-${level}`, name: 'Organic Chemistry: Some Basic Principles and Techniques', difficulty: Difficulty.HARD, topics: [{ id: `tc8-${level}`, name: 'IUPAC Nomenclature', estimatedHours: 8 }] },
          { id: `c9-${level}`, name: 'Hydrocarbons', difficulty: Difficulty.MEDIUM, topics: [{ id: `tc9-${level}`, name: 'Alkanes, Alkenes, Alkynes', estimatedHours: 7 }] }
        ]
      },
      {
        id: `mat-${level}`,
        name: 'Mathematics',
        chapters: [
          { id: `m1-${level}`, name: 'Sets', difficulty: Difficulty.EASY, topics: [{ id: `tm1-${level}`, name: 'Operations on Sets', estimatedHours: 4 }] },
          { id: `m2-${level}`, name: 'Relations and Functions', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm2-${level}`, name: 'Domain and Range', estimatedHours: 5 }] },
          { id: `m3-${level}`, name: 'Trigonometric Functions', difficulty: Difficulty.HARD, topics: [{ id: `tm3-${level}`, name: 'Trigonometric Equations', estimatedHours: 7 }] },
          { id: `m4-${level}`, name: 'Complex Numbers and Quadratic Equations', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm4-${level}`, name: 'Polar Representation', estimatedHours: 6 }] },
          { id: `m5-${level}`, name: 'Linear Inequalities', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm5-${level}`, name: 'Graphical Solution', estimatedHours: 5 }] },
          { id: `m6-${level}`, name: 'Permutations and Combinations', difficulty: Difficulty.HARD, topics: [{ id: `tm6-${level}`, name: 'Fundamental Principle of Counting', estimatedHours: 6 }] },
          { id: `m7-${level}`, name: 'Binomial Theorem', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm7-${level}`, name: 'Pascal’s Triangle', estimatedHours: 4 }] },
          { id: `m8-${level}`, name: 'Sequences and Series', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm8-${level}`, name: 'AP and GP', estimatedHours: 6 }] },
          { id: `m9-${level}`, name: 'Straight Lines', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm9-${level}`, name: 'Slope of a Line', estimatedHours: 5 }] },
          { id: `m10-${level}`, name: 'Conic Sections', difficulty: Difficulty.HARD, topics: [{ id: `tm10-${level}`, name: 'Parabola & Ellipse', estimatedHours: 6 }] },
          { id: `m11-${level}`, name: 'Introduction to Three-dimensional Geometry', difficulty: Difficulty.EASY, topics: [{ id: `tm11-${level}`, name: 'Distance Formula', estimatedHours: 3 }] },
          { id: `m12-${level}`, name: 'Limits and Derivatives', difficulty: Difficulty.HARD, topics: [{ id: `tm12-${level}`, name: 'First Principle', estimatedHours: 7 }] },
          { id: `m13-${level}`, name: 'Statistics', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm13-${level}`, name: 'Standard Deviation', estimatedHours: 5 }] },
          { id: `m14-${level}`, name: 'Probability', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm14-${level}`, name: 'Axiomatic Probability', estimatedHours: 5 }] }
        ]
      },
      {
        id: `bio-${level}`,
        name: 'Biology',
        chapters: [
          { id: `b1-${level}`, name: 'The Living World', difficulty: Difficulty.EASY, topics: [{ id: `tb1-${level}`, name: 'Taxonomy', estimatedHours: 3 }] },
          { id: `b2-${level}`, name: 'Biological Classification', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb2-${level}`, name: 'Five Kingdom Classification', estimatedHours: 4 }] },
          { id: `b3-${level}`, name: 'Plant Kingdom', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb3-${level}`, name: 'Algae & Bryophytes', estimatedHours: 5 }] },
          { id: `b4-${level}`, name: 'Animal Kingdom', difficulty: Difficulty.HARD, topics: [{ id: `tb4-${level}`, name: 'Phylum Chordata', estimatedHours: 6 }] },
          { id: `b5-${level}`, name: 'Morphology of Flowering Plants', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb5-${level}`, name: 'Inflorescence', estimatedHours: 4 }] },
          { id: `b6-${level}`, name: 'Anatomy of Flowering Plants', difficulty: Difficulty.HARD, topics: [{ id: `tb6-${level}`, name: 'Tissues', estimatedHours: 5 }] },
          { id: `b7-${level}`, name: 'Structural Organisation in Animals', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb7-${level}`, name: 'Animal Tissues', estimatedHours: 4 }] },
          { id: `b8-${level}`, name: 'Cell: The Unit of Life', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb8-${level}`, name: 'Cell Organelles', estimatedHours: 5 }] },
          { id: `b9-${level}`, name: 'Biomolecules', difficulty: Difficulty.HARD, topics: [{ id: `tb9-${level}`, name: 'Enzymes', estimatedHours: 5 }] },
          { id: `b10-${level}`, name: 'Cell Cycle and Cell Division', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb10-${level}`, name: 'Mitosis & Meiosis', estimatedHours: 4 }] },
          { id: `b11-${level}`, name: 'Photosynthesis in Higher Plants', difficulty: Difficulty.HARD, topics: [{ id: `tb11-${level}`, name: 'Light Reaction', estimatedHours: 6 }] },
          { id: `b12-${level}`, name: 'Respiration in Plants', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb12-${level}`, name: 'Glycolysis', estimatedHours: 5 }] },
          { id: `b13-${level}`, name: 'Plant Growth and Development', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb13-${level}`, name: 'Plant Hormones', estimatedHours: 4 }] },
          { id: `b14-${level}`, name: 'Breathing and Exchange of Gases', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb14-${level}`, name: 'Respiratory System', estimatedHours: 4 }] },
          { id: `b15-${level}`, name: 'Body Fluids and Circulation', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb15-${level}`, name: 'Cardiac Cycle', estimatedHours: 5 }] },
          { id: `b16-${level}`, name: 'Excretory Products and their Elimination', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb16-${level}`, name: 'Urine Formation', estimatedHours: 5 }] },
          { id: `b17-${level}`, name: 'Locomotion and Movement', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb17-${level}`, name: 'Muscle Contraction', estimatedHours: 4 }] },
          { id: `b18-${level}`, name: 'Neural Control and Coordination', difficulty: Difficulty.HARD, topics: [{ id: `tb18-${level}`, name: 'Nerve Impulse', estimatedHours: 6 }] },
          { id: `b19-${level}`, name: 'Chemical Coordination and Integration', difficulty: Difficulty.MEDIUM, topics: [{ id: `tb19-${level}`, name: 'Hormones', estimatedHours: 4 }] }
        ]
      },
      ...commonIter
    ];
  }

  if (level === 10) {
    return [
      {
        id: `math-${level}`,
        name: 'Mathematics',
        chapters: [
          { id: `m1-${level}`, name: 'Real Numbers', difficulty: Difficulty.EASY, topics: [{ id: `tm1-${level}`, name: 'Fundamental Theorem of Arithmetic', estimatedHours: 3 }] },
          { id: `m2-${level}`, name: 'Polynomials', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm2-${level}`, name: 'Zeros of a Polynomial', estimatedHours: 4 }] },
          { id: `m3-${level}`, name: 'Pair of Linear Equations in Two Variables', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm3-${level}`, name: 'Substitution & Elimination', estimatedHours: 6 }] },
          { id: `m4-${level}`, name: 'Quadratic Equations', difficulty: Difficulty.HARD, topics: [{ id: `tm4-${level}`, name: 'Nature of Roots', estimatedHours: 6 }] },
          { id: `m5-${level}`, name: 'Arithmetic Progressions', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm5-${level}`, name: 'nth Term & Sum', estimatedHours: 5 }] },
          { id: `m6-${level}`, name: 'Triangles', difficulty: Difficulty.HARD, topics: [{ id: `tm6-${level}`, name: 'BPT & Similarity', estimatedHours: 7 }] },
          { id: `m7-${level}`, name: 'Coordinate Geometry', difficulty: Difficulty.EASY, topics: [{ id: `tm7-${level}`, name: 'Distance & Section Formula', estimatedHours: 4 }] },
          { id: `m8-${level}`, name: 'Introduction to Trigonometry', difficulty: Difficulty.HARD, topics: [{ id: `tm8-${level}`, name: 'Trigonometric Ratios', estimatedHours: 8 }] },
          { id: `m9-${level}`, name: 'Some Applications of Trigonometry', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm9-${level}`, name: 'Heights and Distances', estimatedHours: 5 }] },
          { id: `m10-${level}`, name: 'Circles', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm10-${level}`, name: 'Tangents to a Circle', estimatedHours: 5 }] },
          { id: `m11-${level}`, name: 'Areas Related to Circles', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm11-${level}`, name: 'Sector and Segment', estimatedHours: 4 }] },
          { id: `m12-${level}`, name: 'Surface Areas and Volumes', difficulty: Difficulty.HARD, topics: [{ id: `tm12-${level}`, name: 'Combination of Solids', estimatedHours: 7 }] },
          { id: `m13-${level}`, name: 'Statistics', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm13-${level}`, name: 'Mean, Median, Mode', estimatedHours: 6 }] },
          { id: `m14-${level}`, name: 'Probability', difficulty: Difficulty.EASY, topics: [{ id: `tm14-${level}`, name: 'Simple Events', estimatedHours: 3 }] }
        ]
      },
      {
        id: `sci-${level}`,
        name: 'Science',
        chapters: [
          { id: `s1-${level}`, name: 'Chemical Reactions and Equations', difficulty: Difficulty.MEDIUM, topics: [{ id: `ts1-${level}`, name: 'Types of Reactions', estimatedHours: 4 }] },
          { id: `s2-${level}`, name: 'Acids, Bases and Salts', difficulty: Difficulty.MEDIUM, topics: [{ id: `ts2-${level}`, name: 'pH Scale', estimatedHours: 5 }] },
          { id: `s3-${level}`, name: 'Metals and Non-metals', difficulty: Difficulty.MEDIUM, topics: [{ id: `ts3-${level}`, name: 'Reactivity Series', estimatedHours: 5 }] },
          { id: `s4-${level}`, name: 'Carbon and its Compounds', difficulty: Difficulty.HARD, topics: [{ id: `ts4-${level}`, name: 'Bonding in Carbon', estimatedHours: 7 }] },
          { id: `s5-${level}`, name: 'Life Processes', difficulty: Difficulty.HARD, topics: [{ id: `ts5-${level}`, name: 'Nutrition & Respiration', estimatedHours: 8 }] },
          { id: `s6-${level}`, name: 'Control and Coordination', difficulty: Difficulty.MEDIUM, topics: [{ id: `ts6-${level}`, name: 'Nervous System', estimatedHours: 6 }] },
          { id: `s7-${level}`, name: 'How do Organisms Reproduce?', difficulty: Difficulty.MEDIUM, topics: [{ id: `ts7-${level}`, name: 'Modes of Reproduction', estimatedHours: 6 }] },
          { id: `s8-${level}`, name: 'Heredity', difficulty: Difficulty.MEDIUM, topics: [{ id: `ts8-${level}`, name: 'Mendel’s Laws', estimatedHours: 5 }] },
          { id: `s9-${level}`, name: 'Light – Reflection and Refraction', difficulty: Difficulty.HARD, topics: [{ id: `ts9-${level}`, name: 'Mirrors & Lenses', estimatedHours: 8 }] },
          { id: `s10-${level}`, name: 'The Human Eye and the Colourful World', difficulty: Difficulty.MEDIUM, topics: [{ id: `ts10-${level}`, name: 'Defects of Vision', estimatedHours: 4 }] },
          { id: `s11-${level}`, name: 'Electricity', difficulty: Difficulty.HARD, topics: [{ id: `ts11-${level}`, name: 'Ohm’s Law', estimatedHours: 7 }] },
          { id: `s12-${level}`, name: 'Magnetic Effects of Electric Current', difficulty: Difficulty.MEDIUM, topics: [{ id: `ts12-${level}`, name: 'Field Lines', estimatedHours: 5 }] },
          { id: `s13-${level}`, name: 'Our Environment', difficulty: Difficulty.EASY, topics: [{ id: `ts13-${level}`, name: 'Food Chain', estimatedHours: 3 }] }
        ]
      },
      {
        id: `soc-${level}`,
        name: 'Social Science',
        chapters: [
          { id: `his1-${level}`, name: 'The Rise of Nationalism in Europe', difficulty: Difficulty.HARD, topics: [{ id: `th1-${level}`, name: 'French Revolution', estimatedHours: 6 }] },
          { id: `his2-${level}`, name: 'Nationalism in India', difficulty: Difficulty.HARD, topics: [{ id: `th2-${level}`, name: 'Non-Cooperation', estimatedHours: 6 }] },
          { id: `his3-${level}`, name: 'The Making of a Global World', difficulty: Difficulty.MEDIUM, topics: [{ id: `th3-${level}`, name: 'Silk Routes', estimatedHours: 5 }] },
          { id: `his4-${level}`, name: 'The Age of Industrialisation', difficulty: Difficulty.MEDIUM, topics: [{ id: `th4-${level}`, name: 'Factories Come Up', estimatedHours: 5 }] },
          { id: `his5-${level}`, name: 'Print Culture and the Modern World', difficulty: Difficulty.MEDIUM, topics: [{ id: `th5-${level}`, name: 'Reading Mania', estimatedHours: 4 }] },
          { id: `geo1-${level}`, name: 'Resources and Development', difficulty: Difficulty.MEDIUM, topics: [{ id: `tg1-${level}`, name: 'Types of Resources', estimatedHours: 4 }] },
          { id: `geo2-${level}`, name: 'Forest and Wildlife Resources', difficulty: Difficulty.EASY, topics: [{ id: `tg2-${level}`, name: 'Conservation', estimatedHours: 3 }] },
          { id: `geo3-${level}`, name: 'Water Resources', difficulty: Difficulty.EASY, topics: [{ id: `tg3-${level}`, name: 'Dams', estimatedHours: 3 }] },
          { id: `geo4-${level}`, name: 'Agriculture', difficulty: Difficulty.MEDIUM, topics: [{ id: `tg4-${level}`, name: 'Types of Farming', estimatedHours: 5 }] },
          { id: `geo5-${level}`, name: 'Minerals and Energy Resources', difficulty: Difficulty.MEDIUM, topics: [{ id: `tg5-${level}`, name: 'Conventional Sources', estimatedHours: 5 }] },
          { id: `geo6-${level}`, name: 'Manufacturing Industries', difficulty: Difficulty.MEDIUM, topics: [{ id: `tg6-${level}`, name: 'Industrial Pollution', estimatedHours: 5 }] },
          { id: `geo7-${level}`, name: 'Lifelines of National Economy', difficulty: Difficulty.EASY, topics: [{ id: `tg7-${level}`, name: 'Transport', estimatedHours: 4 }] },
          { id: `civ1-${level}`, name: 'Power Sharing', difficulty: Difficulty.EASY, topics: [{ id: `tc1-${level}`, name: 'Belgium & Sri Lanka', estimatedHours: 3 }] },
          { id: `civ2-${level}`, name: 'Federalism', difficulty: Difficulty.MEDIUM, topics: [{ id: `tc2-${level}`, name: 'Decentralization', estimatedHours: 4 }] },
          { id: `civ3-${level}`, name: 'Gender, Religion and Caste', difficulty: Difficulty.MEDIUM, topics: [{ id: `tc3-${level}`, name: 'Politics of Social Divisions', estimatedHours: 4 }] },
          { id: `civ4-${level}`, name: 'Political Parties', difficulty: Difficulty.MEDIUM, topics: [{ id: `tc4-${level}`, name: 'National Parties', estimatedHours: 5 }] },
          { id: `civ5-${level}`, name: 'Outcomes of Democracy', difficulty: Difficulty.HARD, topics: [{ id: `tc5-${level}`, name: 'Accountable Govt', estimatedHours: 5 }] },
          { id: `eco1-${level}`, name: 'Development', difficulty: Difficulty.EASY, topics: [{ id: `te1-${level}`, name: 'Human Development Index', estimatedHours: 4 }] },
          { id: `eco2-${level}`, name: 'Sectors of the Indian Economy', difficulty: Difficulty.MEDIUM, topics: [{ id: `te2-${level}`, name: 'Primary, Secondary, Tertiary', estimatedHours: 5 }] },
          { id: `eco3-${level}`, name: 'Money and Credit', difficulty: Difficulty.MEDIUM, topics: [{ id: `te3-${level}`, name: 'Formal Sector Credit', estimatedHours: 5 }] },
          { id: `eco4-${level}`, name: 'Globalisation and the Indian Economy', difficulty: Difficulty.MEDIUM, topics: [{ id: `te4-${level}`, name: 'MNCs', estimatedHours: 5 }] },
          { id: `eco5-${level}`, name: 'Consumer Rights', difficulty: Difficulty.EASY, topics: [{ id: `te5-${level}`, name: 'Consumer Protection Act', estimatedHours: 3 }] }
        ]
      },
      ...commonIter
    ];
  }

  // Class 8-9 (Generic placeholder for now)
  return [
    {
      id: `math-${level}`,
      name: 'Mathematics',
      chapters: [
        { id: `m1-${level}`, name: 'Rational Numbers', difficulty: Difficulty.EASY, topics: [{ id: `tm1-${level}`, name: 'Properties', estimatedHours: 3 }] },
        { id: `m2-${level}`, name: 'Linear Equations', difficulty: Difficulty.MEDIUM, topics: [{ id: `tm2-${level}`, name: 'Solving Equations', estimatedHours: 4 }] }
      ]
    },
    {
      id: `sci-${level}`,
      name: 'Science',
      chapters: [
        { id: `s1-${level}`, name: 'Crop Production', difficulty: Difficulty.EASY, topics: [{ id: `ts1-${level}`, name: 'Agricultural Practices', estimatedHours: 3 }] },
        { id: `s2-${level}`, name: 'Microorganisms', difficulty: Difficulty.MEDIUM, topics: [{ id: `ts2-${level}`, name: 'Friend and Foe', estimatedHours: 4 }] }
      ]
    },
    {
      id: `soc-${level}`,
      name: 'Social Science',
      isManual: true,
      chapters: [] // Manual
    },
    ...commonIter
  ];
};

export const SYLLABUS_DATA = {
  CBSE: {
    8: { classLevel: 8, subjects: getSubjects(8, 'CBSE') },
    9: { classLevel: 9, subjects: getSubjects(9, 'CBSE') },
    10: { classLevel: 10, subjects: getSubjects(10, 'CBSE') },
    11: { classLevel: 11, subjects: getSubjects(11, 'CBSE') },
    12: { classLevel: 12, subjects: getSubjects(12, 'CBSE') }
  },
  State: {
    8: { classLevel: 8, subjects: getSubjects(8, 'State') },
    9: { classLevel: 9, subjects: getSubjects(9, 'State') },
    10: { classLevel: 10, subjects: getSubjects(10, 'State') },
    11: { classLevel: 11, subjects: getSubjects(11, 'State') },
    12: { classLevel: 12, subjects: getSubjects(12, 'State') }
  }
};

// Legacy export for backward compatibility during refactor (defaulting to CBSE)
export const SYLLABUS_COLLECTION = SYLLABUS_DATA.CBSE;

// Default export for backward compatibility
export const CBSE_SYLLABUS_DATA = SYLLABUS_COLLECTION[10];

export const RESOURCE_LIBRARY: Resource[] = [
  { id: 'r1', subjectId: 'math-10', title: 'CBSE Official Sample Paper 2024-25', type: 'Sample Paper', year: '2025', link: '#' },
  { id: 'r2', subjectId: 'math-10', title: 'Mathematics Standard PYQ 2023', type: 'PYQ', year: '2023', link: '#' },
  { id: 'r3', subjectId: 'sci-10', title: 'Science Official Sample Paper 2024', type: 'Sample Paper', year: '2024', link: '#' },
  { id: 'r4', subjectId: 'phy-12', title: 'Physics Class 12 PYQ 2023', type: 'PYQ', year: '2023', link: '#' },
  { id: 'r5', subjectId: 'mat-12', title: 'Class 12 Math Sample Paper 2025', type: 'Sample Paper', year: '2025', link: '#' },
  { id: 'r6', subjectId: 'che-12', title: 'Chemistry Sample Paper 2024', type: 'Sample Paper', year: '2024', link: '#' }
];

export const DEFAULT_WEEKLY_HOURS = [
  { weekday: 0, hours: 6 }, { weekday: 1, hours: 3 }, { weekday: 2, hours: 3 },
  { weekday: 3, hours: 3 }, { weekday: 4, hours: 3 }, { weekday: 5, hours: 3 },
  { weekday: 6, hours: 5 }
];
