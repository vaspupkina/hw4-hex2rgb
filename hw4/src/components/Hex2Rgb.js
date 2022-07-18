import React, {useState} from 'react'
import PropTypes from 'prop-types'

/* Функциональный компонент конвертер */
function Hex2Rgb({onColorConverted, onFailed, defaultValue}) {

    const [colorValue, setColorValue] = useState("");
    
    const onError = () => {
        setColorValue(() => {
            return "#ошибка!";
        });

        if (onFailed) {
            onFailed();
        }
    }

    // возвращаем индекс переданнного символа от 0..15 если
    // символ это буква a-z или цифра 0-9, иначе -1
    const getHexCharIndex = (character) => {
        return '0123456789abcdef'.indexOf(character); 
    }

    // конвертирует строку с числом в 16й системе в десятичную
    const hexStrToInt = (hexValue) => {
        // на всякий случай конвертим в верхний регистр
        var hex = hexValue.toLowerCase();
        
        var result = 0;
        
        /* справа налево умножаем код каждого символа (0..15), 
           таким образом преобразовывем число в десятичную систему
           счисления поразрядно, умножая Ascii код символа на 
           16 в степени индекса разряда.
           Причем индекс считается справа налево, от нуля. 
           Например: A12F это
           Результат = код('F')*(16^0) +    // 0й индекс разряда 
           код('2')*(16^1) +                // 1й индекс разряда
           код('1')*(16^2) +                // 2й индекс разряда
           код('A')*(16^3);                 // 3й индекс разряда*/
        for (var i=hex.length-1; i>=0; --i) {
            var reverseIndex = (hex.length-1) - i; // индекса считаем справа налево
            result += Math.pow(16, reverseIndex) * getHexCharIndex(hex[i]);
        }

        return result;
    }

    const onChangeHandler = (event) => {
        // проверяем не пришел ли корявое событие
        if (event) {
            // предотвращаем любую прочую обработку события
            event.preventDefault();
            event.stopPropagation();
        }
        
        // переводим все символы строки в нижний регистр для удобства
        var color = event.target.value.toLowerCase();

        if (color.length !== 7) {
            return; // просто игнорим, пока не дождались ввода всех символов
        }

        // если первый символ не решетка, то ошибка
        if (!color.startsWith("#"))
        {
            onError();
            return;
        }

        color = color.slice(1);
        
        // если хоть один символ не a-f или
        // цифра 0..9, то ошибка
        for (var i=0; i<color.length; ++i)
        {
            if (getHexCharIndex(color[i]) < 0) {
                onError();
                return;
            }
        }

        var R = hexStrToInt(color.slice(0, 2)).toString(); // берем первые два символа после решетки        
        var G = hexStrToInt(color.slice(2, 4)).toString(); // берем вторые два символа после решетки
        var B = hexStrToInt(color.slice(4, 6)).toString(); // берем третьи два символа после решетки

        setColorValue(() => {
            // форматируем строку как rgb(число, число, число)
            var result =`rgb(${R}, ${G}, ${B})`;

            // триггерим хэндлер что цвет пересчитали
            if (onColorConverted) {
                onColorConverted(result, event.target.value.toLowerCase());
            }

            return result;
        });
    };

    return (<>
                <input maxLength="7" defaultValue={defaultValue} onChange={onChangeHandler} />
                <br/>
                <input disabled={true} value={colorValue}/>
            </>
)
}

Hex2Rgb.propTypes = {
    onColorConverted : PropTypes.func,
    onFailed : PropTypes.func,
    defaultValue : PropTypes.string
}

Hex2Rgb.defaultProps = {
    defaultValue : ""
}

export default Hex2Rgb
