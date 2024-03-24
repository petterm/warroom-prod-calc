import React, { useState } from 'react';
import './ProductionCalc.css';

type Cost = {
    oil: number,
    steel: number,
    osr: number
}
type Resource = keyof Cost;
type UnitType = 'LAND' | 'AIR' | 'SEA';
type UnitName = 'INF' | 'ART' | 'ARM' | 'FTR' | 'BMR' | 'SS' | 'CR' | 'CV' | 'BB';
type Unit = {
    name: UnitName,
    cost: Cost,
    color: string,
    type: UnitType,
}

type UnitPurchase = {
    unit: UnitName,
    amount: number,
}

const colors = {
    green: 'rgb(0 117 0)',
    yellow: '#ffff00',
    red: 'rgb(171 55 55)',
    blue: '#4949fb',
}

const resources: { [NAME in Resource ]: { color: string } } = {
    'oil': { color: colors.red },
    'steel': { color: colors.blue },
    'osr': { color: colors.yellow },
}

const units: { [NAME in UnitName]: Unit } = {
    'INF': { name: 'INF', color: colors.yellow, cost: { oil: 0, steel: 0, osr: 2 }, type: 'LAND' },
    'ART': { name: 'ART', color: colors.blue, cost: { oil: 0, steel: 2, osr: 1 }, type: 'LAND' },
    'ARM': { name: 'ARM', color: colors.green, cost: { oil: 1, steel: 2, osr: 1 }, type: 'LAND' },
    'FTR': { name: 'FTR', color: colors.green, cost: { oil: 2, steel: 1, osr: 1 }, type: 'AIR' },
    'BMR': { name: 'BMR', color: colors.red, cost: { oil: 2, steel: 2, osr: 1 }, type: 'AIR' },
    'SS': { name: 'SS', color: colors.yellow, cost: { oil: 1, steel: 2, osr: 1 }, type: 'SEA' },
    'CR': { name: 'CR', color: colors.blue, cost: { oil: 2, steel: 3, osr: 2 }, type: 'SEA' },
    'CV': { name: 'CV', color: colors.green, cost: { oil: 4, steel: 3, osr: 3 }, type: 'SEA' },
    'BB': { name: 'BB', color: colors.red, cost: { oil: 3, steel: 4, osr: 3 }, type: 'SEA' },
};
const unitNames: UnitName[] = Object.keys(units) as UnitName[];

const createEmptyCart = (): UnitPurchase[] => unitNames.map(name => ({ unit: name, amount: 0}));

const getTotal = (cart: UnitPurchase[]): Cost => cart.reduce((total, cartUnit) => ({
    oil: total.oil + (cartUnit.amount * units[cartUnit.unit].cost.oil),
    steel: total.steel + (cartUnit.amount * units[cartUnit.unit].cost.steel),
    osr: total.osr + (cartUnit.amount * units[cartUnit.unit].cost.osr),
}), { oil: 0, steel: 0, osr: 0 });

// Show cost even with amount is 1 (but will be styled as empty)
function Cost(props: { type: Resource, cost: number, amount: number }) {
    const {type, cost, amount} = props;
    const color = amount ? resources[type].color : '';
    if (cost === 0) {
        return (
            <div className={`unit__cost unit__cost_${type} unit__cost_disabled`}>
                &nbsp;
            </div>
        )
    }
    return (
        <div className={`unit__cost unit__cost_${type}`} style={{color}}>
            {cost * Math.max(amount, 1)}
        </div>
    )
}

function UnitRow(props: { unitName: UnitName, amount: number, onAdd: () => void, onSubtract: () => void }) {
    const {unitName, amount, onAdd, onSubtract} = props;
    const unit = units[unitName];
    return (

<div key={unit.name} className={['unit', `unit-${unitName}`, amount ? '' : 'unit-empty'].join(' ')}>
            <button className='unit__name' onClick={onAdd} style={{ color: unit.color}}>
                <div className={`unit__shape_${unitName.toLowerCase()}`}>
                    <div>
                        <div>
                            {unit.name}
                        </div>
                    </div>
                </div>
            </button>
            <Cost type='oil' cost={unit.cost.oil} amount={amount} />
            <Cost type='steel' cost={unit.cost.steel} amount={amount} />
            <Cost type='osr' cost={unit.cost.osr} amount={amount} />
            <button className='unit__cost unit__amount' onClick={onSubtract}>{amount}</button>
        </div>
    )
};

function ProductionCalc() {
    const [cart, updateCart] = useState<UnitPurchase[]>(createEmptyCart());
    
    const addUnit = (name: UnitName) => {
        updateCart(cart.map(({ unit, amount }) => ({ unit, amount: amount + (unit === name ? 1 : 0) })));
    }
    const subtractUnit = (name: UnitName) => {
        updateCart(cart.map(({ unit, amount }) => ({ unit, amount: unit === name ? Math.max(amount - 1, 0) : amount })));
    }

    const total = getTotal(cart);
    return (
        <div className='productionCalc'>
            {cart.map(({ unit, amount }) => (
                <UnitRow key={unit} unitName={unit} amount={amount} onAdd={() => addUnit(unit)} onSubtract={() => subtractUnit(unit)} />
            ))}
            <div className='unit unit-total'>
                <div className='unit__name'>Total</div>
                <div className='unit__cost unit__cost_oil'>{total.oil}</div>
                <div className='unit__cost unit__cost_steel'>{total.steel}</div>
                <div className='unit__cost unit__cost_osr'>{total.osr}</div>
                <div className='unit__cost unit__amount'>{cart.reduce((totalAmount, { amount }) => totalAmount + amount, 0)}</div>
            </div>
        </div>
    )
};


export default ProductionCalc;