import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useHotels } from "../context/HotelsContext";

const HotelForm = ({ editingHotel, onFinish }) => {
  const { addHotel, updateHotel } = useHotels();
  const { register, handleSubmit, reset, setValue } = useForm();
  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => {
    if (editingHotel) {
      // Prellenar form al editar
      Object.keys(editingHotel).forEach(key => {
        if (key !== "id") setValue(key, editingHotel[key]);
      });
      setLogoPreview(editingHotel.logo || "");
    } else {
      reset();
      setLogoPreview("");
    }
  }, [editingHotel, reset, setValue]);

  const onSubmit = (data) => {
    const hotelData = {
      ...data,
      rooms: {
        single: Number(data.single) || 0,
        twoTwin: Number(data.twoTwin) || 0,
        oneQueen: Number(data.oneQueen) || 0,
      },
      stars: Number(data.stars) || 3,
      score: Number(data.score) || 0,
      logo: logoPreview,
    };

    if (editingHotel) {
      updateHotel(editingHotel.id, { ...hotelData, id: editingHotel.id });
    } else {
      addHotel(hotelData);
    }

    reset();
    setLogoPreview("");
    onFinish();
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="card shadow p-4 mb-4 rounded-4">
      <h5 className="mb-3">{editingHotel ? "Editar Hotel" : "Agregar Hotel"}</h5>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input className="form-control mb-2" placeholder="Nombre" {...register("name", { required: true })} />
        <input className="form-control mb-2" placeholder="Descripción" {...register("description")} />
        <input className="form-control mb-2" placeholder="País" {...register("country")} />
        <input className="form-control mb-2" placeholder="Departamento" {...register("department")} />
        <input className="form-control mb-2" placeholder="Ciudad" {...register("city")} />
        <input type="number" className="form-control mb-2" placeholder="Estrellas" {...register("stars", { min: 1, max: 5 })} />
        <input type="number" className="form-control mb-2" placeholder="Score" {...register("score")} />

        <h6>Habitaciones</h6>
        <input type="number" className="form-control mb-2" placeholder="Single" {...register("single")} />
        <input type="number" className="form-control mb-2" placeholder="Two Twin" {...register("twoTwin")} />
        <input type="number" className="form-control mb-2" placeholder="One Queen" {...register("oneQueen")} />

        <div className="mb-2">
          <label className="form-label">Logo</label>
          <input type="file" className="form-control" onChange={handleLogoChange} />
        </div>
        {logoPreview && <img src={logoPreview} alt="Logo Preview" className="mb-2" style={{ height: "120px", objectFit: "cover" }} />}

        <button className="btn btn-primary w-100">{editingHotel ? "Guardar Cambios" : "Agregar Hotel"}</button>
      </form>
    </div>
  );
};

export default HotelForm;
