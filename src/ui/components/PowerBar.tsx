import { COLORS } from '@/ui/theme/colors';

interface PowerBarProps {
    onUndo?: () => void;
    onRestart?: () => void;
    onHint?: () => void;
    undoDisabled?: boolean;
}

export function PowerBar({ onUndo, onRestart, onHint, undoDisabled = true }: PowerBarProps) {
    return (
        <div
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60px',
                backgroundColor: COLORS.powerBarBg,
                borderTop: `1px solid ${COLORS.gridLine}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '15px',
                padding: '0 15px',
                zIndex: 10,
            }}
        >
            {[
                { icon: '💡', label: 'Hint', action: onHint, disabled: true },
                { icon: '↩️', label: 'Undo', action: onUndo, disabled: undoDisabled },
                { icon: '🔄', label: 'Restart', action: onRestart, disabled: false },
                { icon: '✨', label: 'Magic', action: undefined, disabled: true },
            ].map((btn) => (
                <button
                    key={btn.label}
                    onClick={btn.action}
                    disabled={btn.disabled ?? btn.action === undefined}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        padding: '6px 12px',
                        backgroundColor: btn.disabled ? COLORS.buttonBg : COLORS.neonBlue,
                        border: btn.disabled ? 'none' : `1px solid ${COLORS.neonBlue}`,
                        borderRadius: '8px',
                        color: btn.disabled ? COLORS.textDim : '#fff',
                        fontSize: '18px',
                        cursor: btn.disabled ? 'not-allowed' : 'pointer',
                        opacity: btn.disabled ? 0.5 : 1,
                    }}
                >
                    <span>{btn.icon}</span>
                    <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{btn.label}</span>
                </button>
            ))}
        </div>
    );
}
