const layers = [
  ['green', 'Sometime_Green'],
  ['red', 'Sometime_Red'],
  ['lilac', 'Sometime_Lilac'],
  ['widget-large', 'Sometime_Widget_Large'],
  ['widget-medium', 'Sometime_Widget_Medium'],
  ['widget-small', 'Sometime_Widget_Small'],
  ['task', 'Sometime_Task'],
  ['main', 'Sometime_Main'],
] as const;

export default function SometimeScene({ background }: { background: string }) {
  return (
    <div className="sometime-scene" aria-hidden="true">
      <img className="sometime-background" src={background} alt="" draggable={false} />
      {layers.map(([layer, asset]) => (
        <img
          key={layer}
          className={`sometime-layer sometime-${layer}${layer.startsWith('widget') ? '' : ' sometime-phone'}`}
          src={`/projects/sometime/${asset}.webp`}
          alt=""
          draggable={false}
          decoding="async"
        />
      ))}
    </div>
  );
}
