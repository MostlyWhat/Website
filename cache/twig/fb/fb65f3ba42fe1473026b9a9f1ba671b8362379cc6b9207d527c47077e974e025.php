<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* @nucleus/layout/block.html.twig */
class __TwigTemplate_a3cc2bf7d12f274f690914b7a0298d6a81776976bb324641ae1459f277da7af8 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 1
        $context["attr_extra"] = $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->attributeArrayFilter($this->getAttribute($this->getAttribute(($context["segment"] ?? null), "attributes", []), "extra", []));
        // line 2
        echo "
";
        // line 3
        $context["class"] = ((("g-block " . call_user_func_array($this->env->getFilter('toGrid')->getCallable(), [$this->getAttribute($this->getAttribute(($context["segment"] ?? null), "attributes", []), "size", [])])) . (($this->getAttribute($this->getAttribute(        // line 4
($context["segment"] ?? null), "attributes", []), "variations", [])) ? ((" " . twig_join_filter($this->getAttribute($this->getAttribute(($context["segment"] ?? null), "attributes", []), "variations", []), " "))) : (""))) . (($this->getAttribute($this->getAttribute(        // line 5
($context["segment"] ?? null), "attributes", []), "class", [])) ? ((" " . twig_join_filter($this->getAttribute($this->getAttribute(($context["segment"] ?? null), "attributes", []), "class", []), " "))) : ("")));
        // line 6
        echo "
";
        // line 7
        ob_start();
        // line 8
        echo "    ";
        if ($this->getAttribute(($context["segment"] ?? null), "children", [])) {
            // line 9
            echo "        ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["segments"] ?? null));
            $context['loop'] = [
              'parent' => $context['_parent'],
              'index0' => 0,
              'index'  => 1,
              'first'  => true,
            ];
            if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof \Countable)) {
                $length = count($context['_seq']);
                $context['loop']['revindex0'] = $length - 1;
                $context['loop']['revindex'] = $length;
                $context['loop']['length'] = $length;
                $context['loop']['last'] = 1 === $length;
            }
            foreach ($context['_seq'] as $context["_key"] => $context["segment"]) {
                // line 10
                echo "            ";
                if ($this->getAttribute($context["segment"], "content", [])) {
                    // line 11
                    echo "                ";
                    echo $this->getAttribute($context["segment"], "content", []);
                    echo "
            ";
                } else {
                    // line 13
                    echo "                ";
                    $this->loadTemplate([0 => (("@nucleus/content/" . $this->getAttribute($context["segment"], "type", [])) . ".html.twig"), 1 => (("@nucleus/layout/" . $this->getAttribute($context["segment"], "type", [])) . ".html.twig")], "@nucleus/layout/block.html.twig", 13)->display(twig_array_merge($context, ["segments" => $this->getAttribute($context["segment"], "children", [])]));
                    // line 14
                    echo "            ";
                }
                // line 15
                echo "        ";
                ++$context['loop']['index0'];
                ++$context['loop']['index'];
                $context['loop']['first'] = false;
                if (isset($context['loop']['length'])) {
                    --$context['loop']['revindex0'];
                    --$context['loop']['revindex'];
                    $context['loop']['last'] = 0 === $context['loop']['revindex0'];
                }
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['segment'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 16
            echo "    ";
        }
        $context["html"] = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        // line 19
        if (twig_trim_filter(($context["html"] ?? null))) {
            // line 20
            echo "        <div ";
            if ($this->getAttribute($this->getAttribute(($context["segment"] ?? null), "attributes", []), "id", [])) {
                echo "id=\"";
                echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute(($context["segment"] ?? null), "attributes", []), "id", []), "html", null, true);
                echo "\" ";
            }
            echo "class=\"";
            echo twig_escape_filter($this->env, ($context["class"] ?? null), "html", null, true);
            echo "\"";
            echo ($context["attr_extra"] ?? null);
            echo ">
             ";
            // line 21
            echo twig_trim_filter(($context["html"] ?? null));
            echo "
        </div>
";
        }
    }

    public function getTemplateName()
    {
        return "@nucleus/layout/block.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  113 => 21,  100 => 20,  98 => 19,  94 => 16,  80 => 15,  77 => 14,  74 => 13,  68 => 11,  65 => 10,  47 => 9,  44 => 8,  42 => 7,  39 => 6,  37 => 5,  36 => 4,  35 => 3,  32 => 2,  30 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("{% set attr_extra = segment.attributes.extra|attribute_array %}

{% set class = 'g-block ' ~ segment.attributes.size|toGrid
    ~ (segment.attributes.variations ? ' ' ~ segment.attributes.variations|join(' '))
    ~ (segment.attributes.class ? ' ' ~ segment.attributes.class|join(' ')) %}

{% set html %}
    {% if segment.children %}
        {% for segment in segments %}
            {% if segment.content %}
                {{ segment.content|raw }}
            {% else %}
                {% include ['@nucleus/content/' ~ segment.type ~ '.html.twig', '@nucleus/layout/' ~ segment.type ~ '.html.twig'] with { 'segments': segment.children } %}
            {% endif %}
        {% endfor %}
    {% endif %}
{% endset %}

{%- if html|trim %}
        <div {% if segment.attributes.id %}id=\"{{ segment.attributes.id }}\" {% endif %}class=\"{{ class }}\" {{- attr_extra|raw }}>
             {{ html|trim|raw }}
        </div>
{% endif -%}
", "@nucleus/layout/block.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\engines\\nucleus\\templates\\layout\\block.html.twig");
    }
}
