import {Toast, Frame, Page, Button} from '@shopify/polaris';
import {useState, useCallback} from 'react';

export default function ErrorToast(props) {

  const [active, setActive] = useState(false);

  //Переключатель активности по нажатию кнопки
  const toggleActive = useCallback(() => {
    (props.title && props.description && props.price) ?  "":
    setActive((active) => active = true)
  });

  //На закрытие сообщения об ошибке
  const onDismiss = useCallback(() => setActive((active) => !active), []); //Почему []?

  //Если активна - показать toast
  const toastMarkup = active ? (
    <Toast content="Server error" error onDismiss={onDismiss} />
  ) : null;

  return (
    <div style={{height: '250px'}}>
        <Button submit onClick={toggleActive}>Submit</Button>
          {toastMarkup}
    </div>
  );
}