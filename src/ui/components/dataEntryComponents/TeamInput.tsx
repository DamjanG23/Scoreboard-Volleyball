import { useState, useEffect } from "react";

interface TeamsInputProps {
  team: Team | undefined;
}

const ensure14Players = (players?: Player[]): Player[] => {
  const base = players ? [...players] : [];
  while (base.length < 14) {
    base.push({ number: base.length + 1, name: "" });
  }
  return base.slice(0, 14);
};

export function TeamsInput({ team }: TeamsInputProps) {
  const [formTeam, setFormTeam] = useState<Team>(() => ({
    name: team?.name ?? "",
    coach: team?.coach ?? "",
    logoPath: team?.logoPath ?? "",
    color: team?.color ?? "#ffffff",
    players: ensure14Players(team?.players),
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [backupTeam, setBackupTeam] = useState<Team | null>(null);

  useEffect(() => {
    if (!isEditing) {
      if (team) {
        setFormTeam({
          name: team.name,
          coach: team.coach,
          logoPath: team.logoPath,
          color: team.color,
          players: ensure14Players(team.players),
        });
      } else {
        setFormTeam({
          name: "",
          coach: "",
          logoPath: "",
          color: "#ffffff",
          players: ensure14Players(undefined),
        });
      }
    }
  }, [team, isEditing]);

  const handleEditSaveClick = () => {
    if (!isEditing) {
      setBackupTeam(formTeam);
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setBackupTeam(null);
      console.log("Saving team:", formTeam);
    }
  };

  const handleCancelClick = () => {
    if (backupTeam) {
      setFormTeam(backupTeam);
    }
    setIsEditing(false);
    setBackupTeam(null);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "10px" }}>
      {/* BUTTONS */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          justifyContent: "center",
        }}
      >
        <button onClick={handleEditSaveClick}>
          {isEditing ? "Save" : "Edit"}
        </button>
        <button onClick={() => console.log("Load clicked")}>Load</button>
        <button onClick={handleCancelClick}>X</button>
      </div>

      {/* TEAM NAME */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Team Name:{" "}
          <input
            type="text"
            value={formTeam.name}
            disabled={!isEditing}
            style={{ width: "200px" }}
            onChange={(e) =>
              setFormTeam((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </label>
      </div>

      {/* COACH */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Coach:{" "}
          <input
            type="text"
            value={formTeam.coach}
            disabled={!isEditing}
            style={{ width: "200px" }}
            onChange={(e) =>
              setFormTeam((prev) => ({ ...prev, coach: e.target.value }))
            }
          />
        </label>
      </div>

      {/* 14 PLAYERS */}
      <div style={{ marginTop: "20px" }}>
        <strong>Players:</strong>

        {formTeam.players.map((player, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "5px",
            }}
          >
            {/* NUMBER */}
            <input
              type="number"
              min={1}
              value={player.number}
              disabled={!isEditing}
              style={{ width: "60px" }}
              onChange={(e) => {
                const num = parseInt(e.target.value || "0", 10);
                setFormTeam((prev) => {
                  const players = [...prev.players];
                  players[index] = { ...players[index], number: num };
                  return { ...prev, players };
                });
              }}
            />

            {/* NAME */}
            <input
              type="text"
              value={player.name}
              placeholder={`Player ${index + 1} name`}
              disabled={!isEditing}
              style={{ width: "200px" }}
              onChange={(e) =>
                setFormTeam((prev) => {
                  const players = [...prev.players];
                  players[index] = { ...players[index], name: e.target.value };
                  return { ...prev, players };
                })
              }
            />
          </div>
        ))}
      </div>

      {/* COLOR + LOGO SECTION */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
          gap: "40px",
        }}
      >
        {/* COLOR PICKER + PREVIEW */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              marginInline: "auto",
              backgroundColor: formTeam.color || "#ffffff",
            }}
          />
          <div>
            <label>
              Color:{" "}
              <input
                type="color"
                disabled={!isEditing}
                value={formTeam.color}
                onChange={(e) =>
                  setFormTeam((prev) => ({ ...prev, color: e.target.value }))
                }
              />
            </label>
          </div>
        </div>

        {/* LOGO PREVIEW + PATH INPUT */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              marginInline: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
            }}
          >
            {formTeam.logoPath ? (
              <img
                src={formTeam.logoPath}
                alt="Team logo"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <span style={{ fontSize: "12px", color: "#888" }}>
                No logo selected
              </span>
            )}
          </div>
          <div>
            <label>
              Logo path:{" "}
              <input
                type="text"
                disabled={!isEditing}
                value={formTeam.logoPath}
                style={{ width: "200px" }}
                onChange={(e) =>
                  setFormTeam((prev) => ({
                    ...prev,
                    logoPath: e.target.value,
                  }))
                }
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
