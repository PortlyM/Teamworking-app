'use client'

import Button from "./Button"

export default function PathPanel() {
    return (
        <div>
            <Button text='Main' path='/dashboard'/>
            <Button text='Chat' path='/chat'/>
            <Button text='Team' path='/team'/>
        </div>
    )
}