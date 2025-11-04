import { InputHTMLAttributes } from "react"
import { formatReal } from 'app/util/money'
import { FormatUtils } from '@4us-dev/utils'

const formatUtils = new FormatUtils

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    id: string
    label: string
    columnClasses?: string
    error?: string
    formatter?: (value: string) => string
}

export const Input: React.FC<InputProps> = ({
    label,
    columnClasses,
    id,
    error,
    formatter,
    onChange,
    ...inputProps
}:InputProps) => {

    const onInputChange = (event: any) => {
        const value = event.target.value
        const name = event.target.name

        const formattedValue = (formatter && formatter(value as string)) || value

        if(onChange){
            onChange({
                ...event,
                target:{
                    name,
                    value: formattedValue
                }
            })
        }
    }

    return(
        <div className={`field column ${columnClasses}`} >
            <label className="label" htmlFor={id}>{label}</label>
            <div className="control">
                <input className="input" type="text"
                id={id} {...inputProps}
                onChange={onInputChange}/>
                {error &&
                    <p className="help is-danger">{ error }</p>
                }
            </div>
        </div>
    )
}

export const InputMoney: React.FC<InputProps> = (props:InputProps) => {
    return (
        <Input {...props} formatter={formatReal}/>
    )
}

export const InputCnpj: React.FC<InputProps> = (props:InputProps) => {
    return (
        <Input {...props} formatter={formatUtils.formatCNPJ}/>
    )
}

export const InputTelefone: React.FC<InputProps> = (props:InputProps) => {
    return (
        <Input {...props} formatter={formatUtils.formatPhone}/>
    )
}