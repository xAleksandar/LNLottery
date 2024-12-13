import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type Props = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePasswordVisibility?: () => void;
};

const InputField = (props: Props) => {
  const {
    label,
    value,
    error,
    isPassword = false,
    showPassword = false,
    onChange,
    onTogglePasswordVisibility,
  } = props;
  return (
    <TextField
      label={label}
      value={value}
      error={error !== ""}
      helperText={error}
      type={!isPassword || showPassword ? "text" : "password"}
      onChange={onChange}
      InputProps={{
        style: {
          color: "white",
          backgroundColor: "#191C2E",
          borderRadius: "12px",
        },
        endAdornment: isPassword && (
          <InputAdornment position="end">
            <IconButton onClick={onTogglePasswordVisibility} edge="end">
              {showPassword ? (
                <VisibilityOff style={{ color: "white" }} />
              ) : (
                <Visibility style={{ color: "white" }} />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
      InputLabelProps={{
        style: { color: "white" },
      }}
    />
  );
};

export default InputField;
