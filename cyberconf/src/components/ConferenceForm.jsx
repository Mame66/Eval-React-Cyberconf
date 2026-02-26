import { useState, useEffect } from "react";

const EMPTY = {
  id: "",
  title: "",
  date: "",
  description: "",
  img: "",
  content: "",
  duration: "",
  design: {
    mainColor: "#e8ff47",
    secondColor: "#ff4757"
  },
  speakers: [],
  stakeholders: [],
  osMap: {
    addressl1: "",
    addressl2: "",
    postalCode: "",
    city: ""
  }
};

export default function ConferenceForm({ conf, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [speakerFirstname, setSpeakerFirstname] = useState("");
  const [speakerLastname, setSpeakerLastname] = useState("");

  const [stakeFirstname, setStakeFirstname] = useState("");
  const [stakeLastname, setStakeLastname] = useState("");
  const [stakeJob, setStakeJob] = useState("");
  const [stakeImg, setStakeImg] = useState("");

  useEffect(() => {
    if (conf) {
      setForm(conf);
    } else {
      setForm(EMPTY);
    }
  }, [conf]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDesignChange = (e) => {
    setForm({
      ...form,
      design: {
        ...form.design,
        [e.target.name]: e.target.value
      }
    });
  };

  const addSpeaker = () => {
    if (!speakerFirstname || !speakerLastname) return;

    setForm({
      ...form,
      speakers: [
        ...form.speakers,
        { firstname: speakerFirstname, lastname: speakerLastname }
      ]
    });

    setSpeakerFirstname("");
    setSpeakerLastname("");
  };

  const removeSpeaker = (index) => {
    const newSpeakers = form.speakers.filter((_, i) => i !== index);
    setForm({ ...form, speakers: newSpeakers });
  };

  const addStakeholder = () => {
    if (!stakeFirstname || !stakeLastname) return;

    setForm({
      ...form,
      stakeholders: [
        ...form.stakeholders,
        {
          firstname: stakeFirstname,
          lastname: stakeLastname,
          job: stakeJob,
          img: stakeImg
        }
      ]
    });

    setStakeFirstname("");
    setStakeLastname("");
    setStakeJob("");
    setStakeImg("");
  };

  const removeStakeholder = (index) => {
    const newStake = form.stakeholders.filter((_, i) => i !== index);
    setForm({ ...form, stakeholders: newStake });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.date || !form.description) {
      setError("Veuillez remplir les champs obligatoires.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError("Erreur lors de l'enregistrement");
    }

    setLoading(false);
  };

  return (
      <div className="modal-overlay">
        <div className="modal">
          <h2>{conf ? "Modifier conférence" : "Nouvelle conférence"}</h2>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            {!conf && (
                <input
                    name="id"
                    placeholder="ID"
                    value={form.id}
                    onChange={handleChange}
                />
            )}

            <input
                name="title"
                placeholder="Titre"
                value={form.title}
                onChange={handleChange}
            />

            <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
            />

            <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
            />

            <input
                name="img"
                placeholder="Image URL"
                value={form.img}
                onChange={handleChange}
            />

            <textarea
                name="content"
                placeholder="Contenu"
                value={form.content}
                onChange={handleChange}
            />

            <input
                name="duration"
                placeholder="Durée"
                value={form.duration}
                onChange={handleChange}
            />

            <h4>Couleurs</h4>

            <input
                type="color"
                name="mainColor"
                value={form.design.mainColor}
                onChange={handleDesignChange}
            />

            <input
                type="color"
                name="secondColor"
                value={form.design.secondColor}
                onChange={handleDesignChange}
            />

            <h4>Speakers</h4>

            {form.speakers.map((s, i) => (
                <div key={i}>
                  {s.firstname} {s.lastname}
                  <button type="button" onClick={() => removeSpeaker(i)}>
                    Supprimer
                  </button>
                </div>
            ))}

            <input
                placeholder="Prénom"
                value={speakerFirstname}
                onChange={(e) => setSpeakerFirstname(e.target.value)}
            />

            <input
                placeholder="Nom"
                value={speakerLastname}
                onChange={(e) => setSpeakerLastname(e.target.value)}
            />

            <button type="button" onClick={addSpeaker}>
              Ajouter Speaker
            </button>

            <h4>Stakeholders</h4>

            {form.stakeholders.map((s, i) => (
                <div key={i}>
                  {s.firstname} {s.lastname} {s.job}
                  <button type="button" onClick={() => removeStakeholder(i)}>
                    Supprimer
                  </button>
                </div>
            ))}

            <input
                placeholder="Prénom"
                value={stakeFirstname}
                onChange={(e) => setStakeFirstname(e.target.value)}
            />

            <input
                placeholder="Nom"
                value={stakeLastname}
                onChange={(e) => setStakeLastname(e.target.value)}
            />

            <input
                placeholder="Poste"
                value={stakeJob}
                onChange={(e) => setStakeJob(e.target.value)}
            />

            <input
                placeholder="Image URL"
                value={stakeImg}
                onChange={(e) => setStakeImg(e.target.value)}
            />

            <button type="button" onClick={addStakeholder}>
              Ajouter Partenaire
            </button>

            <br />

            <button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>

            <button type="button" onClick={onClose}>
              Annuler
            </button>
          </form>
        </div>
      </div>
  );
}