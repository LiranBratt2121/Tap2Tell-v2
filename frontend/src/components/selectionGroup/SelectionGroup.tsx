import { Header, RadioContainer, RadioImage, Text} from "../../pages/register/styles.register";

type SelectionOption<T> = {
  type: T;
  label: string;
  image: string;
};

type SelectionGroupProps<T> = {
  title: string;
  options: SelectionOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
};

export function SelectionGroup<T extends string>({ title, options, selected, onSelect }: SelectionGroupProps<T>) {
  const getStyle = (value: T, isText = false) => ({
    opacity: !selected || selected === value ? 1 : 0.5,
    transform: selected === value && isText ? 'scale(1.05)' : selected === value ? 'scale(1.1)' : 'scale(1)',
    transition: 'all 0.3s ease',
  });

  return (
    <>
      <Header>{title}</Header>
      <RadioContainer>
        {options.map(({ type, label, image }) => (
          <div key={type}>
            <RadioImage src={image} onClick={() => onSelect(type)} style={getStyle(type)} />
            <Text style={getStyle(type, true)}>{label}</Text>
          </div>
        ))}
      </RadioContainer>
    </>
  );
}
