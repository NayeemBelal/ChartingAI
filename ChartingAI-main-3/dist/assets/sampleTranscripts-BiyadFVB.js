const n=`Clinician: How have your sugars been over the past two weeks?
Patient: They’ve been running 140–180 fasting, sometimes higher after dinner.
Clinician: Any dizziness, chest pain, or blurred vision?
Patient: No chest pain. Some mild headaches when it gets high.
Clinician: Let's reinforce diet and timing of metformin. We'll add a walking routine and monitor readings.`,t=`Clinician: How long has the fever been present?
Parent: About two days with runny nose and less appetite.
Clinician: Any breathing difficulty, rash, or vomiting?
Parent: No breathing issues or rash; one episode of vomiting yesterday.
Clinician: Likely viral illness. Encourage fluids, fever control, and follow up if symptoms worsen.`;function r(i){const e=i.toLowerCase();return e.includes("diabetes")?n:e.includes("pediatric")||e.includes("fever")?t:null}export{r as sampleTranscriptForName};
