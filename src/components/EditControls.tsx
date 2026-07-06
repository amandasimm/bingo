interface EditControlsProps {
  editing: boolean;
  onToggle: () => void;
}

function EditControls({ editing, onToggle }: EditControlsProps) {
  return (
    <button className="edit-button" onClick={onToggle} type="button">
      {editing ? 'Done' : 'Edit'}
    </button>
  );
}

export default EditControls;
