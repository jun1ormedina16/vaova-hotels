import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, onChange }) => {
  return (
    <div>
      {[1,2,3,4,5].map((i) => (
        <FaStar
          key={i}
          size={24}
          style={{ cursor: "pointer", marginRight: 5 }}
          color={i <= rating ? "#ffc107" : "#e4e5e9"}
          onClick={() => onChange(i)}
        />
      ))}
    </div>
  );
};

export default StarRating;
